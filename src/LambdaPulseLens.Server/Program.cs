using LambdaPulse.Engine.Features.Logging;
using LambdaPulse.Engine.Features.Routing;
using LambdaPulse.Engine.Hosting;
using LambdaPulse.Engine.Shared.Extensions;
using LambdaPulse.Server.Services;

#region Static pages

var loginPage = new Endpoint
{
    Method = "GET",
    Path = "/login",
    ApplicationFunction = async (webContext, cancellationToken) =>
    {
        webContext.StaticFileRelativePath = "/login/index.html";
    },
    AllowAnonymous = true,
};

var registerPage = new Endpoint
{
    Method = "GET",
    Path = "/register",
    ApplicationFunction = async (webContext, cancellationToken) =>
    {
        webContext.StaticFileRelativePath = "/register/index.html";
    },
    AllowAnonymous = true,
};

var homePage = new Endpoint
{
    Method = "GET",
    Path = "/",
    ApplicationFunction = async (webContext, cancellationToken) =>
    {
        webContext.StaticFileRelativePath = "/home/index.html";
    },
    AllowAnonymous = true
};

#endregion Static pages

#region API

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
    AllowAnonymous = true
};

#endregion API

//Postgres DB storing trace logs
var postgresConnection = Environment.GetEnvironmentVariable("LAMBDAPULSE_POSTGRES_CONNECTION") ?? throw new InvalidOperationException("LAMBDAPULSE_POSTGRES_CONNECTION environment variable is not set.");

var webServer = ServerBuilder.Build(
    configureEndpoints: endpointRegistry =>
    {
        endpointRegistry.AddEndpoint(loginPage);
        endpointRegistry.AddEndpoint(registerPage);
        endpointRegistry.AddEndpoint(homePage);
        endpointRegistry.AddEndpoint(healthCheck);
    },
    configureServices: container =>
    {
        container.AddSingleton(new PostgresConfig { ConnectionString = postgresConnection });
        container.OverrideSingleton<ITraceLogger, PostgresTraceLogger>();
    }
);

await webServer.StartServer();
