using LambdaPulse.Server.Services.Auth.Models;

namespace LambdaPulse.Server.Services.Auth;

internal sealed class PostgresAuthRepository : IAuthRepository
{
    public Task<AuthUser> CreateUser(string email, string passwordHash, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<AuthUser> FindByEmail(string email, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
