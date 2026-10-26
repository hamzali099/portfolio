using Microsoft.EntityFrameworkCore;

namespace Portfolio.Web.Data;

public static class DatabaseSetup
{
    /// <summary>
    /// Uses PostgreSQL when ConnectionStrings:Default is set (e.g. a free Neon database),
    /// otherwise a local SQLite file in App_Data.
    /// </summary>
    public static IServiceCollection AddPortfolioDatabase(this IServiceCollection services, IConfiguration config, IWebHostEnvironment env)
    {
        var connection = config.GetConnectionString("Default");

        if (string.IsNullOrWhiteSpace(connection))
        {
            var dir = Path.Combine(env.ContentRootPath, "App_Data");
            Directory.CreateDirectory(dir);
            var file = Path.Combine(dir, "portfolio.db");
            return services.AddDbContext<AppDbContext>(o => o.UseSqlite($"Data Source={file}"));
        }

        return services.AddDbContext<AppDbContext>(o => o.UseNpgsql(ToNpgsql(connection)));
    }

    // Hosting providers hand out URLs like postgresql://user:pass@host:5432/db?sslmode=require,
    // but Npgsql expects key=value pairs.
    private static string ToNpgsql(string connection)
    {
        if (!connection.StartsWith("postgres://") && !connection.StartsWith("postgresql://"))
            return connection;

        var uri = new Uri(connection);
        var userInfo = uri.UserInfo.Split(':', 2);
        var parts = new List<string>
        {
            $"Host={uri.Host}",
            $"Port={(uri.Port > 0 ? uri.Port : 5432)}",
            $"Database={uri.AbsolutePath.TrimStart('/')}",
            $"Username={Uri.UnescapeDataString(userInfo[0])}",
            $"Password={(userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "")}",
            "SSL Mode=Require",
        };
        return string.Join(';', parts);
    }
}
