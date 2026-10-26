using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Web.Models;
using Portfolio.Web.Services;

namespace Portfolio.Web.Controllers;

public class HomeController : Controller
{
    private readonly IProfileService _profileService;

    public HomeController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    // Hosts the React app; the profile is also passed to the view for SEO meta tags.
    public async Task<IActionResult> Index(CancellationToken cancellationToken)
    {
        var profile = await _profileService.GetProfileAsync(cancellationToken);
        return View(profile);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
