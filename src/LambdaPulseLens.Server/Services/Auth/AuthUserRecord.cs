namespace LambdaPulse.Server.Services.Auth;

internal sealed class AuthUserRecord
{
    public required long Id { get; init; }
    public required string Email { get; init; }
    public required string PasswordHash { get; init; }
    public required DateTimeOffset CreatedAt { get; init; }
    public required DateTimeOffset UpdatedAt { get; init; }
}
