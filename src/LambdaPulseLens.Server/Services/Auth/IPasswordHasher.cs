namespace LambdaPulse.Server.Services.Auth;

internal interface IPasswordHasher
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string passwordHash);
}
