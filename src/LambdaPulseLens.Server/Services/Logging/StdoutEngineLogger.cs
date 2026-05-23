using LambdaPulse.Engine.Features.Logging;
using System.Text.Json;

namespace LambdaPulse.Server.Services.Logging;

internal sealed class StdoutEngineLogger : IEngineLogger
{
    public void Log(LogLevel logLevel, string source, string message, Exception? exception = null)
    {
        var entry = new
        {
            TimeStamp = DateTime.UtcNow,
            ApplicationName = "LambdaPulse.Server",
            LogLevel = logLevel.ToString(),
            Source = source,
            Message = message,
            ExceptionType = exception?.GetType().FullName,
            Exception = exception?.ToString(),
            ThreadId = Environment.CurrentManagedThreadId
        };

        Console.WriteLine(JsonSerializer.Serialize(entry));
    }
}
