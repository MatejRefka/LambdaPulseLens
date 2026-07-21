using LambdaPulse.Engine.Features.Authentication;
using LambdaPulse.Engine.Features.Logging;
using LambdaPulse.Engine.Features.Routing;
using LambdaPulse.Engine.Features.Security;
using LambdaPulse.Engine.Features.State.Cache;
using LambdaPulse.Engine.Hosting;
using LambdaPulse.Engine.Shared.Extensions;
using LambdaPulse.Server.Services.Auth;
using LambdaPulse.Server.Services.State;
using LambdaPulse.Server.Services.Telemetry;
using StackExchange.Redis;
using System.Globalization;
using System.Security.Cryptography;
using System.Text.Json;
using System.Text.RegularExpressions;

#region Instantiations

//Postgres storing trace logs
var postgresConfig = new PostgresConfig { ConnectionString = Environment.GetEnvironmentVariable("LAMBDAPULSE_POSTGRES_CONNECTION") ?? throw new InvalidOperationException("LAMBDAPULSE_POSTGRES_CONNECTION environment variable is not set.") };

//Redis cache
var redisConnection = Environment.GetEnvironmentVariable("LAMBDAPULSE_REDIS_CONNECTION") ?? throw new InvalidOperationException("LAMBDAPULSE_REDIS_CONNECTION environment variable is not set.");
var redisConnectionManager = await ConnectionMultiplexer.ConnectAsync(redisConnection);

//services
BCryptPasswordHasher passwordHasher = new();
PostgresAuthRepository authRepository = new(postgresConfig);
PostgresTelemetryRepository telemetryRepository = new(postgresConfig);
LiveTraceBroadcaster traceBroadcaster = new();

#endregion Instantiations

#region Health Check Endpoint
var healthCheckEndpoint = new Endpoint
{
    Method = "GET",
    Path = "/api/health",
    AllowAnonymous = true,
    CachePolicy = new CachePolicy { Enabled = true, DurationSeconds = 120 },
    ApplicationFunction = async (webContext, cancellationToken) =>
    {
        webContext.WebResponse.StatusCode = 200;
        webContext.WebResponse.ResponsePhrase = "OK";
        await webContext.WebResponse.WriteJsonToBody(new { Health = "Healthy" }, cancellationToken);
    }
};
#endregion Health Check Endpoint

#region Auth Endpoints

//issues CSRF token
var csrfEndpoint = new Endpoint
{
    Method = "GET",
    Path = "/api/auth/csrf",
    AllowAnonymous = true,
    SkipCsrf = true,
    CachePolicy = new CachePolicy { Enabled = false },
    ApplicationFunction = async (webContext, cancellationToken) =>
    {
        //indicate that the response should not be cached by browsers or CDNs
        webContext.WebResponse.Headers["Cache-Control"] = "no-store";

        if (webContext.Session == null)
        {
            webContext.WebResponse.StatusCode = 500;
            webContext.WebResponse.ResponsePhrase = "Internal Server Error";
            await webContext.WebResponse.WriteJsonToBody(new { success = false }, cancellationToken);
            return;
        }

        var existingToken = await webContext.Session.GetValue<string>(SecurityConstants.CsrfTokenSessionKey);

        var csrfToken = !string.IsNullOrWhiteSpace(existingToken) ? existingToken : Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

        await webContext.Session.SetValue(SecurityConstants.CsrfTokenSessionKey, csrfToken);

        webContext.WebResponse.StatusCode = 200;
        webContext.WebResponse.ResponsePhrase = "OK";
        await webContext.WebResponse.WriteJsonToBody(new { success = true, token = csrfToken }, cancellationToken);
    }

};

var registerEndpoint = new Endpoint
{
    Method = "POST",
    Path = "/api/auth/register",
    AllowAnonymous = true,
    CachePolicy = new CachePolicy { Enabled = false },
    ApplicationFunction = async (webContext, cancellationToken) =>
    {
        //indicate that the response should not be cached by browsers or CDNs
        webContext.WebResponse.Headers["Cache-Control"] = "no-store";

        var request = JsonSerializer.Deserialize<RegisterRequest>(webContext.WebRequest.Body ?? string.Empty, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (request == null)
        {
            webContext.WebResponse.StatusCode = 400;
            webContext.WebResponse.ResponsePhrase = "Bad Request";
            await webContext.WebResponse.WriteJsonToBody(new { success = false, message = "Bad Request." }, cancellationToken);
            return;
        }

        var email = !string.IsNullOrWhiteSpace(request.Email) ? request.Email.Trim() : string.Empty;
        var password = request.Password;

        //match front-end email validation (Zod)
        var isEmailValid = !string.IsNullOrWhiteSpace(email) && Regex.IsMatch(email, @"^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$");
        var isPasswordValid = !string.IsNullOrWhiteSpace(password) && password.Length >= 6;

        //server-side validation
        if (!isEmailValid || !isPasswordValid)
        {
            webContext.WebResponse.StatusCode = 400;
            webContext.WebResponse.ResponsePhrase = "Bad Request";
            await webContext.WebResponse.WriteJsonToBody(new { success = false, message = "Invalid email or password." }, cancellationToken);
            return;
        }

        var existingUser = await authRepository.GetUserByEmail(email, cancellationToken);
        //user already exists
        if (existingUser != null)
        {
            webContext.WebResponse.StatusCode = 409;
            webContext.WebResponse.ResponsePhrase = "Conflict";
            await webContext.WebResponse.WriteJsonToBody(new { success = false, message = "Account with this email already exists." }, cancellationToken);
            return;
        }

        var passwordHash = passwordHasher.HashPassword(password);
        var newUser = await authRepository.CreateUser(email, passwordHash, cancellationToken);

        if (webContext.Session == null)
        {
            webContext.WebResponse.StatusCode = 500;
            webContext.WebResponse.ResponsePhrase = "Internal Server Error";
            await webContext.WebResponse.WriteJsonToBody(new { success = false, message = "Internal Server Error." }, cancellationToken);
            return;
        }

        var userId = newUser.Id.ToString(CultureInfo.InvariantCulture);
        await webContext.Session.SetValue(AuthenticationConstants.UserIdSessionKey, userId);
        webContext.User = new AuthenticatedUser(userId);
        webContext.Trace.UserId = userId;
        webContext.Trace.AssociatedUserId = userId;

        await telemetryRepository.LinkAnonymousSessionToUser(webContext.PreSessionToken, webContext.AnonymousSessionToken, newUser.Id, cancellationToken);


        webContext.WebResponse.StatusCode = 201;
        webContext.WebResponse.ResponsePhrase = "Created";
        await webContext.WebResponse.WriteJsonToBody(new { success = true, user = new { id = newUser.Id, email = newUser.Email } }, cancellationToken);
    }
};

var loginEndpoint = new Endpoint
{
    Method = "POST",
    Path = "/api/auth/login",
    AllowAnonymous = true,
    CachePolicy = new CachePolicy { Enabled = false },
    ApplicationFunction = async (webContext, cancellationToken) =>
    {
        //indicate that the response should not be cached by browsers or CDNs
        webContext.WebResponse.Headers["Cache-Control"] = "no-store";

        var request = JsonSerializer.Deserialize<LoginRequest>(webContext.WebRequest.Body ?? string.Empty, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (request == null)
        {
            webContext.WebResponse.StatusCode = 400;
            webContext.WebResponse.ResponsePhrase = "Bad Request";
            await webContext.WebResponse.WriteJsonToBody(new { success = false, message = "Bad Request." }, cancellationToken);
            return;
        }

        var email = !string.IsNullOrWhiteSpace(request.Email) ? request.Email.Trim() : string.Empty;
        var password = request.Password;

        //match front-end email validation (Zod)
        var isEmailValid = !string.IsNullOrWhiteSpace(email) && Regex.IsMatch(email, @"^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$");
        var isPasswordValid = !string.IsNullOrWhiteSpace(password) && password.Length >= 6;

        //server-side validation
        if (!isEmailValid || !isPasswordValid)
        {
            webContext.WebResponse.StatusCode = 400;
            webContext.WebResponse.ResponsePhrase = "Bad Request";
            await webContext.WebResponse.WriteJsonToBody(new { success = false, message = "Bad Request." }, cancellationToken);
            return;
        }

        var user = await authRepository.GetUserByEmail(email, cancellationToken);

        if (user == null)
        {
            //prevent timing attacks which reveal whether an account exists or not
            passwordHasher.VerifyPassword(password, AuthenticationConstants.DummyPasswordHash);

            webContext.WebResponse.StatusCode = 401;
            webContext.WebResponse.ResponsePhrase = "Unauthorized";
            await webContext.WebResponse.WriteJsonToBody(new { success = false, message = "Invalid email or password." }, cancellationToken);
            return;
        }

        var isPasswordVerified = passwordHasher.VerifyPassword(password, user.PasswordHash);

        if (!isPasswordVerified)
        {
            webContext.WebResponse.StatusCode = 401;
            webContext.WebResponse.ResponsePhrase = "Unauthorized";
            await webContext.WebResponse.WriteJsonToBody(new { success = false, message = "Invalid email or password." }, cancellationToken);
            return;
        }

        if (webContext.Session == null)
        {
            webContext.WebResponse.StatusCode = 500;
            webContext.WebResponse.ResponsePhrase = "Internal Server Error";
            await webContext.WebResponse.WriteJsonToBody(new { success = false, message = "Internal Server Error." }, cancellationToken);
            return;
        }

        var userId = user.Id.ToString(CultureInfo.InvariantCulture);
        await webContext.Session.SetValue(AuthenticationConstants.UserIdSessionKey, userId);
        webContext.User = new AuthenticatedUser(userId);
        webContext.Trace.UserId = userId;
        webContext.Trace.AssociatedUserId = userId;

        await telemetryRepository.LinkAnonymousSessionToUser(webContext.PreSessionToken, webContext.AnonymousSessionToken, user.Id, cancellationToken);


        webContext.WebResponse.StatusCode = 200;
        webContext.WebResponse.ResponsePhrase = "OK";
        await webContext.WebResponse.WriteJsonToBody(new { success = true, user = new { id = user.Id, email = user.Email } }, cancellationToken);
    }
};

//indicates whether the user is authenticated and returns user info
var meEndpoint = new Endpoint
{
    Method = "GET",
    Path = "/api/auth/me",
    AllowAnonymous = true,
    CachePolicy = new CachePolicy { Enabled = false, },
    ApplicationFunction = async (webContext, cancellationToken) =>
    {
        //indicate that the response should not be cached by browsers or CDNs
        webContext.WebResponse.Headers["Cache-Control"] = "no-store";

        //user not authenticated
        if (!webContext.User.IsAuthenticated)
        {
            webContext.WebResponse.StatusCode = 401;
            webContext.WebResponse.ResponsePhrase = "Unauthorized";
            await webContext.WebResponse.WriteJsonToBody(new { success = false }, cancellationToken);
            return;
        }

        //user id missing or invalid
        if (!long.TryParse(webContext.User.Id, out var userId))
        {
            webContext.WebResponse.StatusCode = 401;
            webContext.WebResponse.ResponsePhrase = "Unauthorized";
            await webContext.WebResponse.WriteJsonToBody(new { success = false }, cancellationToken);
            return;
        }

        var user = await authRepository.GetUserById(userId, cancellationToken);

        if (user == null)
        {
            webContext.WebResponse.StatusCode = 401;
            webContext.WebResponse.ResponsePhrase = "Unauthorized";
            await webContext.WebResponse.WriteJsonToBody(new { success = false }, cancellationToken);
            return;
        }

        webContext.WebResponse.StatusCode = 200;
        webContext.WebResponse.ResponsePhrase = "OK";
        await webContext.WebResponse.WriteJsonToBody(new { success = true, user = new { id = user.Id, email = user.Email } }, cancellationToken);
    }
};

var logoutEndpoint = new Endpoint
{
    Method = "POST",
    Path = "/api/auth/logout",
    AllowAnonymous = false,
    SkipCsrf = false,
    CachePolicy = new CachePolicy { Enabled = false },
    ApplicationFunction = async (webContext, cancellationToken) =>
    {
        //indicate that the response should not be cached by browsers or CDNs
        webContext.WebResponse.Headers["Cache-Control"] = "no-store";

        if (webContext.Session == null)
        {
            webContext.WebResponse.StatusCode = 500;
            webContext.WebResponse.ResponsePhrase = "Internal Server Error";
            await webContext.WebResponse.WriteJsonToBody(new { success = false, message = "Internal Server Error." }, cancellationToken);
            return;
        }

        await webContext.Session.RemoveValue(AuthenticationConstants.UserIdSessionKey);

        webContext.User = GuestUser.Instance;
        webContext.SessionInvalidationRequested = true;

        webContext.WebResponse.StatusCode = 200;
        webContext.WebResponse.ResponsePhrase = "OK";
        await webContext.WebResponse.WriteJsonToBody(new { success = true }, cancellationToken);
    }
};

#endregion Auth Endpoints

#region Telemetry Endpoints
//returns trace summaries
var tracesEndpoint = new Endpoint
{
    Method = "GET",
    Path = "/api/telemetry/traces",
    AllowAnonymous = false,
    CachePolicy = new CachePolicy { Enabled = false },
    ApplicationFunction = async (webContext, cancellationToken) =>
    {
        //disable trace logging to avoid internal noise
        webContext.Trace.Enabled = false;

        //indicate that the response should not be cached by browsers or CDNs
        webContext.WebResponse.Headers["Cache-Control"] = "no-store";

        if (!long.TryParse(webContext.User.Id, CultureInfo.InvariantCulture, out var userId))
        {
            webContext.WebResponse.StatusCode = 401;
            webContext.WebResponse.ResponsePhrase = "Unauthorized";
            await webContext.WebResponse.WriteJsonToBody(new { success = false }, cancellationToken);
            return;
        }

        var traces = await telemetryRepository.GetTraceSummaries(userId, cancellationToken);

        webContext.WebResponse.StatusCode = 200;
        webContext.WebResponse.ResponsePhrase = "OK";
        await webContext.WebResponse.WriteJsonToBody(new { success = true, traces }, cancellationToken);
    }
};

//returns full trace
var traceEndpoint = new Endpoint
{
    Method = "GET",
    Path = "/api/telemetry/traces/{id}",
    AllowAnonymous = false,
    //another user may hit the same path. do not cache until cache key is user-scoped
    CachePolicy = new CachePolicy { Enabled = false },
    ApplicationFunction = async (webContext, cancellationToken) =>
    {
        //disable trace logging to avoid internal noise
        webContext.Trace.Enabled = false;

        //indicate that the response should not be cached by browsers or CDNs
        webContext.WebResponse.Headers["Cache-Control"] = "no-store";

        if (!long.TryParse(webContext.User.Id, CultureInfo.InvariantCulture, out var userId))
        {
            webContext.WebResponse.StatusCode = 401;
            webContext.WebResponse.ResponsePhrase = "Unauthorized";
            await webContext.WebResponse.WriteJsonToBody(new { success = false }, cancellationToken);
            return;
        }

        if (webContext.Endpoint == null)
        {
            webContext.WebResponse.StatusCode = 400;
            webContext.WebResponse.ResponsePhrase = "Bad Request";
            await webContext.WebResponse.WriteJsonToBody(new { success = false }, cancellationToken);
            return;
        }

        var traceIdValue = webContext.Endpoint.PathParameters["id"];
        if (string.IsNullOrWhiteSpace(traceIdValue))
        {
            webContext.WebResponse.StatusCode = 400;
            webContext.WebResponse.ResponsePhrase = "Bad Request";
            await webContext.WebResponse.WriteJsonToBody(new { success = false }, cancellationToken);
            return;
        }

        var trace = await telemetryRepository.GetTrace(traceIdValue, userId, cancellationToken);
        if (trace == null)
        {
            webContext.WebResponse.StatusCode = 404;
            webContext.WebResponse.ResponsePhrase = "Not Found";
            await webContext.WebResponse.WriteJsonToBody(new { success = false }, cancellationToken);
            return;
        }

        webContext.WebResponse.StatusCode = 200;
        webContext.WebResponse.ResponsePhrase = "OK";
        await webContext.WebResponse.WriteJsonToBody(new { success = true, trace }, cancellationToken);
    }
};

//live endpoint for SSE clients
var liveTracesEndpoint = new Endpoint
{
    Method = "GET",
    Path = "/api/telemetry/traces/live",
    AllowAnonymous = false,
    CachePolicy = new CachePolicy { Enabled = false },
    ApplicationFunction = async (webContext, cancellationToken) =>
    {
        //disable trace logging to avoid internal noise
        webContext.Trace.Enabled = false;

        if (webContext.User.Id == null)
        {
            webContext.WebResponse.StatusCode = 401;
            webContext.WebResponse.ResponsePhrase = "Unauthorized";
            await webContext.WebResponse.WriteJsonToBody(new { success = false }, cancellationToken);
            return;
        }

        var subscriberId = Guid.NewGuid();

        var channelReader = traceBroadcaster.Subscribe(webContext.User.Id, subscriberId);

        try
        {
            webContext.WebResponse.StatusCode = 200;
            webContext.WebResponse.ResponsePhrase = "OK";

            //content type for SSE
            webContext.WebResponse.Headers["Content-Type"] = "text/event-stream";

            //do not cache SSE responses
            webContext.WebResponse.Headers["Cache-Control"] = "no-store";

            //keep the connection alive for SSE
            webContext.WebResponse.Headers["Connection"] = "keep-alive";

            //disable buffering for SSE
            webContext.WebResponse.Headers["X-Accel-Buffering"] = "no";

            await webContext.WebResponse.StartStreaming(cancellationToken);

            await webContext.WebResponse.WriteToStream(": connected\n\n", cancellationToken);

            await webContext.WebResponse.FlushStream(cancellationToken);

            //loop until the client disconnects or the server shuts down
            await foreach (var traceSummary in channelReader.ReadAllAsync(cancellationToken))
            {
                var traceSummarySerialized = JsonSerializer.Serialize(traceSummary, WebResponseExtensions.CamelCase);

                var message = $"event: trace\nid: {traceSummary.Id}\ndata: {traceSummarySerialized}\n\n";

                await webContext.WebResponse.WriteToStream(message, cancellationToken);
                await webContext.WebResponse.FlushStream(cancellationToken);
            }
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            //browser tab closed, connection lost, server shutdown, etc.
        }
        catch (IOException)
        {
            //client disconnected mid-write (connection reset)
        }
        finally
        {
            //unsubscribe the client from receiving further trace summaries
            traceBroadcaster.Unsubscribe(webContext.User.Id, subscriberId);
        }
    }
};

#endregion Telemetry Endpoints

var webServer = ServerBuilder.Build(
    configureEndpoints: endpointRegistry =>
    {
        endpointRegistry.AddEndpoint(healthCheckEndpoint);
        endpointRegistry.AddEndpoint(csrfEndpoint);
        endpointRegistry.AddEndpoint(registerEndpoint);
        endpointRegistry.AddEndpoint(loginEndpoint);
        endpointRegistry.AddEndpoint(meEndpoint);
        endpointRegistry.AddEndpoint(logoutEndpoint);
        endpointRegistry.AddEndpoint(tracesEndpoint);
        endpointRegistry.AddEndpoint(traceEndpoint);
        endpointRegistry.AddEndpoint(liveTracesEndpoint);
    },
    configureServices: container =>
    {
        container.AddSingleton(postgresConfig);
        container.AddSingleton<ITelemetryRepository, PostgresTelemetryRepository>();

        container.AddSingleton<ILiveTraceBroadcaster>(traceBroadcaster);
        container.OverrideSingleton<ITraceRecorder, TraceRecorder>();

        //Redis connection manager; one per server instance
        container.AddSingleton<IConnectionMultiplexer>(redisConnectionManager);
        container.OverrideSingleton<ICacheStore, RedisCacheStore>();
    }
);

await webServer.StartServer();
