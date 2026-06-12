namespace LambdaPulse.Server.Services.Auth;

internal interface IAuthRepository
{
    Task<AuthUserRecord> CreateUser(string email, string passwordHash, CancellationToken cancellationToken);
    Task<AuthUserRecord?> GetUserById(long id, CancellationToken cancellationToken);
    Task<AuthUserRecord?> GetUserByEmail(string email, CancellationToken cancellationToken);
}
