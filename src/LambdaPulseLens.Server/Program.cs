using LambdaPulse.Engine.Features.Logging;
using LambdaPulse.Engine.Features.Routing;
using LambdaPulse.Engine.Features.State.Cache;
using LambdaPulse.Engine.Hosting;
using LambdaPulse.Engine.Shared.Extensions;
using LambdaPulse.Server.Services;

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

//Postgres DB storing trace logs
var postgresConnection = Environment.GetEnvironmentVariable("LAMBDAPULSE_POSTGRES_CONNECTION") ?? throw new InvalidOperationException("LAMBDAPULSE_POSTGRES_CONNECTION environment variable is not set.");

var webServer = ServerBuilder.Build(
    configureEndpoints: endpointRegistry =>
    {
        endpointRegistry.AddEndpoint(healthCheck);
    },
    configureServices: container =>
    {
        container.AddSingleton(new PostgresConfig { ConnectionString = postgresConnection });
        container.OverrideSingleton<ITraceLogger, PostgresTraceLogger>();
    }
);

await webServer.StartServer();
