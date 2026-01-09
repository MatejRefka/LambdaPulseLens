using LambdaPulse.Server.Features.Routing;
using LambdaPulse.Server.Hosting;
using LambdaPulse.Server.Shared.Extensions;

var webServer = ServerBuilder.Build(
    configureEndpoints: endpointRegistry =>
    {
        endpointRegistry.AddEndpoint(new Endpoint
        {
            Method = "GET",
            Path = "/",
            ApplicationFunction = async (webContext, cancellationToken) =>
            {
                webContext.StaticFileRelativePath = "/index.html";
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
                var pageNumber = webContext.WebRequest.QueryParameters["page"];

                var response = new
                {
                    UserId = userId,
                    OrderId = orderId,
                    PageNumber = pageNumber
                };

                await webContext.WebResponse.WriteJsonToBody(response, ct);
            }
        });
    });

await webServer.StartServer();
