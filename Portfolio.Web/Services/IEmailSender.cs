namespace Portfolio.Web.Services;

public interface IEmailSender
{
    /// <returns>true when the email was handed to a mail provider.</returns>
    Task<bool> SendAsync(string subject, string htmlBody, string? replyTo, CancellationToken cancellationToken = default);
}
