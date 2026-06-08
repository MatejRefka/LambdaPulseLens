using LambdaPulse.Engine.Features.Logging;

namespace LambdaPulse.Server.Services.Telemetry;

internal interface ITelemetryRepository
{
    Task InsertTrace(Trace trace, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Trace>> GetUserTraces(long id, CancellationToken cancellationToken = default);
}
