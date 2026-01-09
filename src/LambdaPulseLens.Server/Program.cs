using LambdaPulse.Server.Hosting;

var server = ServerBuilder.Build();

await server.StartServer();
