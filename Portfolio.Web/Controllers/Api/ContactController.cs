using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Portfolio.Web.Models;
using Portfolio.Web.Services;

namespace Portfolio.Web.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IContactService _contactService;

    public ContactController(IContactService contactService)
    {
        _contactService = contactService;
    }

    // [ApiController] returns 400 with validation details automatically when the model is invalid.
    [HttpPost]
    [EnableRateLimiting("submissions")]
    public async Task<IActionResult> Post([FromBody] ContactMessage message, CancellationToken cancellationToken)
    {
        // Pretend success to bots that filled the hidden field
        if (!string.IsNullOrEmpty(message.Website))
            return Ok(new { success = true, message = "Thanks! Your message has been sent." });

        await _contactService.SendAsync(message, cancellationToken);
        return Ok(new { success = true, message = "Thanks! Your message has been sent. I'll get back to you soon." });
    }
}
