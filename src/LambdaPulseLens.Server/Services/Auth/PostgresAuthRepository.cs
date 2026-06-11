namespace LambdaPulse.Server.Services.Auth;

internal sealed class PostgresAuthRepository : IAuthRepository
{
    public Task<AuthUserRecord> CreateUser(string email, string passwordHash, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<AuthUserRecord> GetUser(string email, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
