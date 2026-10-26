using Microsoft.AspNetCore.Mvc;
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
    public async Task<IActionResult> Post([FromBody] ContactMessage message, CancellationToken cancellationToken)
    {
        await _contactService.SaveAsync(message, cancellationToken);
        return Ok(new { success = true, message = "Thanks! Your message has been received." });
    }
}
