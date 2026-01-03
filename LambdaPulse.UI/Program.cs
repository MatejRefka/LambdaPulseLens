using LambdaPulse.Server;
using LambdaPulse.Server.Services.Http.Routing;
using LambdaPulse.Server.Utility.Extensions;

var endpointRegistry = new EndpointRegistry();
endpointRegistry.AddEndpoint(new Endpoint
{
    Method = "GET",
    Path = "/api/health",
    ApplicationFunction = async (webContext, cancellationToken) =>
    {
        webContext.WebResponse.StatusCode = 200;
        webContext.WebResponse.ResponsePhrase = "OK";
        await webContext.WebResponse.WriteToBody("Healthy");
    }
});

var webServer = ServerBuilder.Build(endpointRegistry);
await webServer.StartServer();
