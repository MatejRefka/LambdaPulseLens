namespace LambdaPulse.Server.Services.Auth;

internal sealed class BCryptPasswordHasher : IPasswordHasher
{
    private const int WorkFactor = 12;

    public string HashPassword(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
        {
            throw new ArgumentException("Password cannot be empty.");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);
        return passwordHash;
    }

    public bool VerifyPassword(string password, string passwordHash)
    {
        if (string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(passwordHash))
        {
            return false;
        }

        var passwordsMatch = BCrypt.Net.BCrypt.Verify(password, passwordHash);
        return passwordsMatch;
    }
}
