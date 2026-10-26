using Portfolio.Web.Models;

namespace Portfolio.Web.Services;

public interface IProfileService
{
    Task<Profile> GetProfileAsync(CancellationToken cancellationToken = default);
}
