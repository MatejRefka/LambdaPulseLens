using LambdaPulse.Server;
using LambdaPulse.Server.Services.Http.Routing;
using LambdaPulse.Server.Utility.Extensions;

var endpointRegistry = new EndpointRegistry();
endpointRegistry.AddEndpoint(new Endpoint
{
    Method = "GET",
    Path = "/",
    ApplicationFunction = async (webContext, cancellationToken) =>
    {
        webContext.StaticFileRelativePath = "/index.html";
        await Task.CompletedTask;
    }
});
endpointRegistry.AddEndpoint(new Endpoint
{
    Method = "GET",
    Path = "/api/health",
    ApplicationFunction = async (webContext, cancellationToken) =>
    {
        webContext.WebResponse.StatusCode = 200;
        webContext.WebResponse.ResponsePhrase = "OK";

        if (string.Equals(webContext.NegotiatedMimeType, "text/plain", StringComparison.OrdinalIgnoreCase))
        {
            await webContext.WebResponse.WriteStringToBody("Healthy", cancellationToken);
            return;
        }

        await webContext.WebResponse.WriteJsonToBody(new { Health = "Healthy" }, cancellationToken);
    }
});

var webServer = ServerBuilder.Build(endpointRegistry);
await webServer.StartServer();
