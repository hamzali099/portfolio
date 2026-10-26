using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Portfolio.Web.Data;
using Portfolio.Web.Models;

namespace Portfolio.Web.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class FeedbackController : ControllerBase
{
    private const int MaxShown = 50;

    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public FeedbackController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var count = await _db.Feedback.CountAsync(cancellationToken);
        var average = count == 0 ? 0 : await _db.Feedback.AverageAsync(f => (double)f.Rating, cancellationToken);
        var items = await _db.Feedback
            .OrderByDescending(f => f.CreatedAt)
            .Take(MaxShown)
            .ToListAsync(cancellationToken);

        return Ok(new { count, average = Math.Round(average, 1), items = items.Select(FeedbackDto.From) });
    }

    [HttpPost]
    [EnableRateLimiting("submissions")]
    public async Task<ActionResult<FeedbackDto>> Post([FromBody] FeedbackInput input, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrEmpty(input.Website))
            return Ok();

        var feedback = new Feedback
        {
            Name = input.Name.Trim(),
            Role = string.IsNullOrWhiteSpace(input.Role) ? null : input.Role.Trim(),
            Rating = input.Rating,
            Comment = input.Comment.Trim(),
        };
        _db.Feedback.Add(feedback);
        await _db.SaveChangesAsync(cancellationToken);

        return Ok(FeedbackDto.From(feedback));
    }

    /// <summary>Removes a comment. Requires the X-Admin-Key header to match the AdminKey setting.</summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, [FromHeader(Name = "X-Admin-Key")] string? adminKey, CancellationToken cancellationToken)
    {
        var expected = _config["AdminKey"];
        if (string.IsNullOrEmpty(expected) || adminKey != expected)
            return Unauthorized();

        var deleted = await _db.Feedback.Where(f => f.Id == id).ExecuteDeleteAsync(cancellationToken);
        return deleted == 0 ? NotFound() : NoContent();
    }
}
