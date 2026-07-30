using LambdaPulse.Features.Logging;

namespace LambdaPulse.Server.Services.Telemetry;

internal interface ITelemetryRepository
{
    Task<TraceSummary> InsertTrace(Trace trace, CancellationToken cancellationToken = default);

    Task LinkAnonymousSessionToUser(string? preSessionToken, string? anonymousSessionToken, long userId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<TraceSummary>> GetTraceSummaries(long userId, CancellationToken cancellationToken = default);

    Task<Trace?> GetTrace(string traceId, long userId, CancellationToken cancellationToken = default);
}
