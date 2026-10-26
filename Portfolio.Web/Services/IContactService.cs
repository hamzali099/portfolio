using Portfolio.Web.Models;

namespace Portfolio.Web.Services;

public interface IContactService
{
    Task SaveAsync(ContactMessage message, CancellationToken cancellationToken = default);
}
