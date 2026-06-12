using LambdaPulse.Engine.Features.Authentication;
using LambdaPulse.Engine.Features.Logging;
using LambdaPulse.Engine.Features.Routing;
using LambdaPulse.Engine.Features.Security;
using LambdaPulse.Engine.Features.State.Cache;
using LambdaPulse.Engine.Hosting;
using LambdaPulse.Engine.Shared.Extensions;
using LambdaPulse.Server.Services.Auth;
using LambdaPulse.Server.Services.Logging;
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

#endregion Instantiations


#region Endpoints
var healthCheck = new Endpoint
{
    Method = "GET",
    Path = "/api/health",
    ApplicationFunction = async (webContext, cancellationToken) =>
    {
        webContext.WebResponse.StatusCode = 200;
        webContext.WebResponse.ResponsePhrase = "OK";
        await webContext.WebResponse.WriteJsonToBody(new { Health = "Healthy" }, cancellationToken);
    },
    AllowAnonymous = true,
    SkipCsrf = false,
    CachePolicy = new CachePolicy
    {
        Enabled = true,
        DurationSeconds = 120
    }
};

//issues CSRF token
var csrf = new Endpoint
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

var register = new Endpoint
{
    Method = "POST",
    Path = "/api/auth/register",
    ApplicationFunction = async (webContext, cancellationToken) =>
    {
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

        var existingUser = await authRepository.GetUser(email, cancellationToken);
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

        await webContext.Session.SetValue(AuthenticationConstants.UserIdSessionKey, newUser.Id.ToString(CultureInfo.InvariantCulture));

        webContext.WebResponse.StatusCode = 201;
        webContext.WebResponse.ResponsePhrase = "Created";
        await webContext.WebResponse.WriteJsonToBody(new { success = true }, cancellationToken);
    },
    AllowAnonymous = true,
    SkipCsrf = false,
    CachePolicy = new CachePolicy
    {
        Enabled = false
    }
};

var login = new Endpoint
{
    Method = "POST",
    Path = "/api/auth/login",
    ApplicationFunction = async (webContext, cancellationToken) =>
    {
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

        var user = await authRepository.GetUser(email, cancellationToken);

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

        await webContext.Session.SetValue(AuthenticationConstants.UserIdSessionKey, user.Id.ToString(CultureInfo.InvariantCulture));

        webContext.WebResponse.StatusCode = 200;
        webContext.WebResponse.ResponsePhrase = "OK";
        await webContext.WebResponse.WriteJsonToBody(new { success = true }, cancellationToken);
    },
    AllowAnonymous = true,
    SkipCsrf = false,
    CachePolicy = new CachePolicy
    {
        Enabled = false
    }
};

#endregion Endpoints


var webServer = ServerBuilder.Build(
    configureEndpoints: endpointRegistry =>
    {
        endpointRegistry.AddEndpoint(healthCheck);
        endpointRegistry.AddEndpoint(csrf);
        endpointRegistry.AddEndpoint(register);
        endpointRegistry.AddEndpoint(login);
    },
    configureServices: container =>
    {
        container.AddSingleton(postgresConfig);
        container.AddSingleton<ITelemetryRepository, PostgresTelemetryRepository>();

        container.OverrideSingleton<ITraceLogger, PostgresTraceLogger>();
        container.OverrideSingleton<IEngineLogger, StdoutEngineLogger>();

        //Redis connection manager; one per server instance
        container.AddSingleton<IConnectionMultiplexer>(redisConnectionManager);
        container.OverrideSingleton<ICacheStore, RedisCacheStore>();
    }
);

await webServer.StartServer();
