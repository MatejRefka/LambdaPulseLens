using LambdaPulse.Server.Features.Routing;
using LambdaPulse.Server.Hosting;
using LambdaPulse.Server.Shared.Extensions;



#region Static pages

var loginPage = new Endpoint
{
    Method = "GET",
    Path = "/login",
    ApplicationFunction = async (webContex, cancellationToken) =>
    {
        webContex.StaticFileRelativePath = "/login/index.html";
    },
    AllowAnonymous = true,
};

var registerPage = new Endpoint
{
    Method = "GET",
    Path = "/register",
    ApplicationFunction = async (webContex, cancellationToken) =>
    {
        webContex.StaticFileRelativePath = "/register/index.html";
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

var healtCheck = new Endpoint
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

var webServer = ServerBuilder.Build(
    configureEndpoints: endpointRegistry =>
    {
        endpointRegistry.AddEndpoint(loginPage);
        endpointRegistry.AddEndpoint(registerPage);
        endpointRegistry.AddEndpoint(homePage);
        endpointRegistry.AddEndpoint(healtCheck);
    },
    configureServices: container =>
    {
        //services can be overridden here with custom implementations
    }
);

await webServer.StartServer();
