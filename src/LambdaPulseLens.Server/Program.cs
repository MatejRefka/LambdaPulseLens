using LambdaPulse.Engine.Features.Logging;
using LambdaPulse.Engine.Features.Routing;
using LambdaPulse.Engine.Features.State.Cache;
using LambdaPulse.Engine.Hosting;
using LambdaPulse.Engine.Shared.Extensions;
using LambdaPulse.Server.Services.Logging;
using LambdaPulse.Server.Services.State;
using StackExchange.Redis;

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
    CachePolicy = new CachePolicy
    {
        Enabled = true,
        DurationSeconds = 120
    }
};

//Postgres storing trace logs
var postgresConnection = Environment.GetEnvironmentVariable("LAMBDAPULSE_POSTGRES_CONNECTION") ?? throw new InvalidOperationException("LAMBDAPULSE_POSTGRES_CONNECTION environment variable is not set.");
//Redis cache
var redisConnection = Environment.GetEnvironmentVariable("LAMBDAPULSE_REDIS_CONNECTION") ?? throw new InvalidOperationException("LAMBDAPULSE_REDIS_CONNECTION environment variable is not set.");
var redisConnectionManager = await ConnectionMultiplexer.ConnectAsync(redisConnection);

var webServer = ServerBuilder.Build(
    configureEndpoints: endpointRegistry =>
    {
        endpointRegistry.AddEndpoint(healthCheck);
    },
    configureServices: container =>
    {
        container.AddSingleton(new PostgresTraceConfig { ConnectionString = postgresConnection });
        container.OverrideSingleton<ITraceLogger, PostgresTraceLogger>();

        container.OverrideSingleton<IEngineLogger, StdoutEngineLogger>();

        //Redis connection manager; one per server instance
        container.AddSingleton<IConnectionMultiplexer>(redisConnectionManager);
        container.OverrideSingleton<ICacheStore, RedisCacheStore>();
    }
);

await webServer.StartServer();
