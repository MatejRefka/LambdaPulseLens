using System.Text.Json;

using LambdaPulse.Features.Logging;

namespace LambdaPulseLens.Server.Services.Logging;

internal sealed class StdoutEngineLogger : IEngineLogger
{
    public void Log(LogLevel logLevel, string source, string message, Exception? exception = null)
    {
        var entry = new
        {
            TimeStamp = DateTime.UtcNow,
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
