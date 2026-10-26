using System.Text.Json;
using Portfolio.Web.Models;

namespace Portfolio.Web.Services;

/// <summary>
/// Appends contact messages to App_Data/messages.jsonl.
/// Swap this for an email (SMTP/SendGrid) implementation when deploying.
/// </summary>
public class FileContactService : IContactService
{
    private static readonly SemaphoreSlim Lock = new(1, 1);

    private readonly string _path;
    private readonly ILogger<FileContactService> _logger;

    public FileContactService(IWebHostEnvironment env, ILogger<FileContactService> logger)
    {
        var dir = Path.Combine(env.ContentRootPath, "App_Data");
        Directory.CreateDirectory(dir);
        _path = Path.Combine(dir, "messages.jsonl");
        _logger = logger;
    }

    public async Task SaveAsync(ContactMessage message, CancellationToken cancellationToken = default)
    {
        var line = JsonSerializer.Serialize(new { ReceivedAt = DateTimeOffset.UtcNow, message.Name, message.Email, message.Subject, message.Message });

        await Lock.WaitAsync(cancellationToken);
        try
        {
            await File.AppendAllTextAsync(_path, line + Environment.NewLine, cancellationToken);
        }
        finally
        {
            Lock.Release();
        }

        _logger.LogInformation("Contact message received from {Email}", message.Email);
    }
}
