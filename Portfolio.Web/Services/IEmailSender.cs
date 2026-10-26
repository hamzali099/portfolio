namespace Portfolio.Web.Services;

/// <param name="Provider">"Resend", "SMTP" or "None".</param>
/// <param name="Error">Why sending failed, when it did.</param>
public record EmailResult(bool Sent, string Provider, string? Error = null);

public interface IEmailSender
{
    Task<EmailResult> SendAsync(string subject, string htmlBody, string? replyTo, CancellationToken cancellationToken = default);
}
