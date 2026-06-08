using LambdaPulse.Server.Services.Auth.Models;

namespace LambdaPulse.Server.Services.Auth;

internal interface IAuthRepository
{
    Task<AuthUser> FindByEmail(string email, CancellationToken cancellationToken);
    Task<AuthUser> CreateUser(string email, string passwordHash, CancellationToken cancellationToken);
}
