using LambdaPulse.Server.Services.Telemetry;
using Npgsql;
using NpgsqlTypes;

namespace LambdaPulse.Server.Services.Auth;

internal sealed class PostgresAuthRepository : IAuthRepository
{
    private readonly string _connectionString;
    public PostgresAuthRepository(PostgresConfig config)
    {
        _connectionString = config.ConnectionString;
    }

    public async Task<AuthUserRecord> CreateUser(string email, string passwordHash, CancellationToken cancellationToken)
    {
        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        var insertUserSql = @"INSERT INTO auth.users(email, password_hash)
                              VALUES (@Email, @PasswordHash)
                              RETURNING id, email, password_hash, created_at, updated_at;";

        await using var command = new NpgsqlCommand(insertUserSql, connection);
        command.Parameters.Add(new NpgsqlParameter("Email", NpgsqlDbType.Text) { Value = email.Trim() });
        command.Parameters.Add(new NpgsqlParameter("PasswordHash", NpgsqlDbType.Text) { Value = passwordHash });

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);

        if (!await reader.ReadAsync(cancellationToken))
        {
            throw new InvalidOperationException("Failed to create user.");
        }

        return GetAuthUserRecord(reader);
    }

    public async Task<AuthUserRecord?> GetUserById(long id, CancellationToken cancellationToken)
    {
        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        var selectUserSql = @"SELECT id, email, password_hash, created_at, updated_at
                              FROM auth.users
                              WHERE id = @Id;";

        await using var command = new NpgsqlCommand(selectUserSql, connection);

        command.Parameters.Add(new NpgsqlParameter("Id", NpgsqlDbType.Bigint) { Value = id });

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);

        if (!await reader.ReadAsync(cancellationToken))
        {
            return null;
        }

        return GetAuthUserRecord(reader);
    }

    public async Task<AuthUserRecord?> GetUserByEmail(string email, CancellationToken cancellationToken)
    {
        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        var selectUserSql = @"SELECT id, email, password_hash, created_at, updated_at
                              FROM auth.users
                              WHERE email_normalized = @EmailNormalized;";

        await using var command = new NpgsqlCommand(selectUserSql, connection);

        command.Parameters.Add(new NpgsqlParameter("EmailNormalized", NpgsqlDbType.Text) { Value = email.Trim().ToLowerInvariant() });

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);

        if (!await reader.ReadAsync(cancellationToken))
        {
            return null;
        }

        return GetAuthUserRecord(reader);
    }

    private static AuthUserRecord GetAuthUserRecord(NpgsqlDataReader reader)
    {
        var idOrdinal = reader.GetOrdinal("id");
        var emailOrdinal = reader.GetOrdinal("email");
        var passwordHashOrdinal = reader.GetOrdinal("password_hash");
        var createdAtOrdinal = reader.GetOrdinal("created_at");
        var updatedAtOrdinal = reader.GetOrdinal("updated_at");

        return new AuthUserRecord
        {
            Id = reader.GetInt64(idOrdinal),
            Email = reader.GetString(emailOrdinal),
            PasswordHash = reader.GetString(passwordHashOrdinal),
            CreatedAt = reader.GetFieldValue<DateTimeOffset>(createdAtOrdinal),
            UpdatedAt = reader.GetFieldValue<DateTimeOffset>(updatedAtOrdinal)
        };
    }
}
