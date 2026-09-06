using LambdaPulse.Features.Logging;
using LambdaPulse.Features.State.Cache;
using StackExchange.Redis;
using System.Text.Json;

namespace LambdaPulseLens.Server.Services.State;

internal sealed class RedisCacheStore : ICacheStore
{
    private const string CacheKeyPrefix = "lambdapulselens:cache:";

    private readonly IDatabase _database;
    private readonly IEngineLogger _engineLogger;
    private static readonly JsonSerializerOptions _jsonSerializerOptions = new() { PropertyNameCaseInsensitive = true };

    public RedisCacheStore(IConnectionMultiplexer connectionMultiplexer, IEngineLogger engineLogger)
    {
        _database = connectionMultiplexer.GetDatabase();
        _engineLogger = engineLogger;
    }

    public async Task<CachedResponse?> GetCachedResponse(string key, CancellationToken cancellationToken = default)
    {
        var redisKey = $"{CacheKeyPrefix}{key}";

        try
        {
            var redisValue = await _database.StringGetAsync(redisKey);

            //cache miss
            if (redisValue.IsNull)
            {
                return null;
            }

            //existing key but empty value
            if (redisValue.IsNullOrEmpty)
            {
                await _database.KeyDeleteAsync(redisKey);
                return null;
            }

            var cachedResponse = JsonSerializer.Deserialize<CachedResponse>(redisValue.ToString(), _jsonSerializerOptions);

            //failed deserialization, corrupted cache entry
            if (cachedResponse == null)
            {
                await _database.KeyDeleteAsync(redisKey);
                return null;
            }

            //backup cache expiry check, Redis TTL already handles this
            if (cachedResponse.ExpiresAt <= DateTimeOffset.UtcNow)
            {
                await _database.KeyDeleteAsync(redisKey);
                return null;
            }

            //cache hit
            return cachedResponse;

        }
        catch (JsonException e)
        {
            //delete corrupt entry
            await _database.KeyDeleteAsync(redisKey);
            _engineLogger.Log(LogLevel.Warning, "RedisCacheStore", $"Deleted corrupted cached response. Key: {redisKey}", e);
            return null;
        }
        catch (Exception e)
        {
            _engineLogger.Log(LogLevel.Warning, "RedisCacheStore", $"Failed retrieving cached response. Key: {CacheKeyPrefix}{key}", e);
            return null;
        }
    }

    public async Task SaveCachedResponse(string key, CachedResponse cachedResponse, CancellationToken cancellationToken = default)
    {
        var redisKey = $"{CacheKeyPrefix}{key}";

        try
        {
            var timeToLive = cachedResponse.ExpiresAt - DateTimeOffset.UtcNow;

            //cache already expired
            if (timeToLive <= TimeSpan.Zero)
            {
                await _database.KeyDeleteAsync(redisKey);
                return;
            }

            var cacheJson = JsonSerializer.Serialize(cachedResponse, _jsonSerializerOptions);

            await _database.StringSetAsync(redisKey, cacheJson, timeToLive);
        }

        catch (Exception e)
        {
            _engineLogger.Log(LogLevel.Warning, "RedisCacheStore", $"Failed setting cached response. Key: {CacheKeyPrefix}{key}", e);
        }
    }
}
