using System.ComponentModel.DataAnnotations;

namespace Portfolio.Web.Models;

public class Feedback
{
    public int Id { get; set; }

    [MaxLength(60)]
    public string Name { get; set; } = "";

    [MaxLength(80)]
    public string? Role { get; set; }

    public int Rating { get; set; }

    [MaxLength(1000)]
    public string Comment { get; set; } = "";

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}

public class FeedbackInput
{
    [Required, StringLength(60, MinimumLength = 2)]
    public string Name { get; set; } = "";

    [StringLength(80)]
    public string? Role { get; set; }

    [Range(1, 5)]
    public int Rating { get; set; }

    [Required, StringLength(1000, MinimumLength = 5)]
    public string Comment { get; set; } = "";

    // Honeypot: hidden in the form, so only bots fill it in
    public string? Website { get; set; }
}

public record FeedbackDto(int Id, string Name, string? Role, int Rating, string Comment, DateTimeOffset CreatedAt)
{
    public static FeedbackDto From(Feedback f) => new(f.Id, f.Name, f.Role, f.Rating, f.Comment, f.CreatedAt);
}
