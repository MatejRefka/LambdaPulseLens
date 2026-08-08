namespace LambdaPulseLens.Server.Services.Telemetry;

internal sealed class TraceSummary
{
    public required string Id { get; init; }
    public string? UserId { get; init; }
    public required DateTimeOffset TimestampStart { get; init; }
    public required float DurationMs { get; init; }
    public string? RequestMethod { get; init; }
    public string? RequestPath { get; init; }
    public string? RequestProtocol { get; init; }
    public required int ResponseStatusCode { get; init; }
    public required string ResponsePhrase { get; init; }
}
