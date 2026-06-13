namespace LambdaPulse.Server.Services.Telemetry;

internal sealed class TraceSummaryRecord
{
    public required long Id { get; init; }
    public long? UserId { get; init; }
    public required DateTimeOffset TimestampStart { get; init; }
    public required long DurationMs { get; init; }
    public string? RequestMethod { get; init; }
    public string? RequestPath { get; init; }
    public string? RequestProtocol { get; init; }
    public required int ResponseStatusCode { get; init; }
    public required string ResponsePhrase { get; init; }
}
