using LambdaPulse.Configuration;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace LambdaPulseLens.Server.Configuration;

/// <summary>
/// Parses the server JSON configuration into the LambdaPulse configuration model.
/// </summary>
internal sealed class ConfigProvider
{
    public Config Config { get; }

    public ConfigProvider()
    {
        Config = LoadConfig();
    }

    private static Config LoadConfig()
    {
        var configDirectory = AppContext.BaseDirectory;
        var developmentConfigPath = Path.Combine(configDirectory, "config.dev.json");
        var configPath = File.Exists(developmentConfigPath)
            ? developmentConfigPath
            : Path.Combine(configDirectory, "config.json");

        var configNode = JsonNode.Parse(File.ReadAllText(configPath))
            ?? throw new ApplicationException("Unable to parse json config.");

        var staticFilesConfig = configNode["ServerConfig"]?["MiddlewareConfig"]?["StaticFilesConfig"];
        var fileRootPath = staticFilesConfig?["FileRootPath"]?.GetValue<string>();

        if (!string.IsNullOrWhiteSpace(fileRootPath) && !Path.IsPathFullyQualified(fileRootPath))
        {
            staticFilesConfig!["FileRootPath"] = Path.GetFullPath(fileRootPath, configDirectory);
        }

        return configNode.Deserialize<Config>() ?? throw new ApplicationException("Unable to parse json config.");
    }
}
