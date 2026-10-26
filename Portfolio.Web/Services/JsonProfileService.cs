using System.Text.Json;
using Portfolio.Web.Models;

namespace Portfolio.Web.Services;

/// <summary>Loads the profile from Data/profile.json and caches it in memory.</summary>
public class JsonProfileService : IProfileService
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    private readonly string _path;
    private Profile? _cached;

    public JsonProfileService(IWebHostEnvironment env)
    {
        _path = Path.Combine(env.ContentRootPath, "Data", "profile.json");
    }

    public async Task<Profile> GetProfileAsync(CancellationToken cancellationToken = default)
    {
        if (_cached is not null) return _cached;

        await using var stream = File.OpenRead(_path);
        _cached = await JsonSerializer.DeserializeAsync<Profile>(stream, JsonOptions, cancellationToken)
                  ?? throw new InvalidOperationException("profile.json is empty or invalid.");
        return _cached;
    }
}
