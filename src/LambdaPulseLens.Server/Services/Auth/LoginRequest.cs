namespace LambdaPulseLens.Server.Services.Auth;

internal sealed class LoginRequest
{
    public required string Email { get; init; }
    public required string Password { get; init; }
}
