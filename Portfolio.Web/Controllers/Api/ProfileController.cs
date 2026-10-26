using Microsoft.AspNetCore.Mvc;
using Portfolio.Web.Models;
using Portfolio.Web.Services;

namespace Portfolio.Web.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;

    public ProfileController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    [HttpGet]
    public async Task<ActionResult<Profile>> Get(CancellationToken cancellationToken)
    {
        return Ok(await _profileService.GetProfileAsync(cancellationToken));
    }
}
