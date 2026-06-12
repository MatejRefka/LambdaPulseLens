using LambdaPulse.Server.Services.Telemetry;

namespace LambdaPulse.Server.Services.Auth;

internal sealed class PostgresAuthRepository : IAuthRepository
{
    private readonly string _connectionString;
    public PostgresAuthRepository(PostgresConfig config)
    {
        _connectionString = config.ConnectionString;
    }

    public Task<AuthUserRecord> CreateUser(string email, string passwordHash, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
    public Task<AuthUserRecord?> GetUserById(long id, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
    public Task<AuthUserRecord?> GetUserByEmail(string email, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
