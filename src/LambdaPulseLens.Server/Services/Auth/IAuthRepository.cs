namespace LambdaPulse.Server.Services.Auth;

internal interface IAuthRepository
{
    Task<AuthUserRecord> CreateUser(string email, string passwordHash, CancellationToken cancellationToken);
    Task<AuthUserRecord> GetUser(string email, CancellationToken cancellationToken);
}
