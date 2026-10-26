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
    private readonly IEmailSender _emailSender;
    private readonly IConfiguration _config;

    public ContactController(IContactService contactService, IEmailSender emailSender, IConfiguration config)
    {
        _contactService = contactService;
        _emailSender = emailSender;
        _config = config;
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

    /// <summary>
    /// Sends a test email and reports exactly what the mail provider said.
    /// Open /api/contact/test?key=YOUR_ADMIN_KEY in a browser.
    /// </summary>
    [HttpGet("test")]
    [EnableRateLimiting("submissions")]
    public async Task<IActionResult> Test([FromQuery] string? key, CancellationToken cancellationToken)
    {
        var expected = _config["AdminKey"];
        if (string.IsNullOrEmpty(expected) || key != expected)
            return Unauthorized(new { error = "Set the AdminKey environment variable and pass it as ?key=..." });

        var result = await _emailSender.SendAsync(
            "Portfolio email test",
            "<p>Your portfolio contact form can send email. 🎉</p>",
            null,
            cancellationToken);

        return Ok(new { result.Sent, result.Provider, result.Error, To = _config["Email:To"] });
    }
}
