using Portfolio.Web.Models;

namespace Portfolio.Web.Services;

public interface IContactService
{
    /// <returns>true when the message was also emailed.</returns>
    Task<bool> SendAsync(ContactMessage message, CancellationToken cancellationToken = default);
}
