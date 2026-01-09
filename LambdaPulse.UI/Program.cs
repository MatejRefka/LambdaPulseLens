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
endpointRegistry.AddEndpoint(new Endpoint
{
    Method = "GET",
    Path = "/api/users/{userId}/orders/{orderId}",
    ApplicationFunction = async (webContext, ct) =>
    {
        // Accessing the path parameter
        var userId = webContext.Endpoint!.PathParameters["userId"];
        var orderId = webContext.Endpoint!.PathParameters["orderId"];

        var response = new
        {
            UserId = userId,
            OrderId = orderId
        };

        await webContext.WebResponse.WriteJsonToBody(response, ct);
    }
});
endpointRegistry.AddEndpoint(new Endpoint
{
    Method = "GET",
    Path = "/api/users/me/orders/{orderId}",
    ApplicationFunction = async (webContext, ct) =>
    {
        var userId = "current user";
        var orderId = webContext.Endpoint!.PathParameters["orderId"];

        var response = new
        {
            UserId = userId,
            OrderId = orderId
        };

        await webContext.WebResponse.WriteJsonToBody(response, ct);
    }
});

var webServer = ServerBuilder.Build(endpointRegistry);
await webServer.StartServer();
