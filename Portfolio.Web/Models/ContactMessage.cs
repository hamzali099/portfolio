using System.ComponentModel.DataAnnotations;

namespace Portfolio.Web.Models;

public class ContactMessage
{
    [Required, StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = "";

    [Required, EmailAddress, StringLength(200)]
    public string Email { get; set; } = "";

    [StringLength(150)]
    public string? Subject { get; set; }

    [Required, StringLength(4000, MinimumLength = 10)]
    public string Message { get; set; } = "";

    // Honeypot: hidden in the form, so only bots fill it in
    public string? Website { get; set; }
}

/// <summary>Stored copy of every contact message, so nothing is lost if email delivery fails.</summary>
public class ContactRecord
{
    public int Id { get; set; }

    [MaxLength(100)]
    public string Name { get; set; } = "";

    [MaxLength(200)]
    public string Email { get; set; } = "";

    [MaxLength(150)]
    public string? Subject { get; set; }

    [MaxLength(4000)]
    public string Message { get; set; } = "";

    public bool EmailSent { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
