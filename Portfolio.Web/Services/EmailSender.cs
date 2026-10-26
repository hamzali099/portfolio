using System.Net;
using System.Net.Http.Headers;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace Portfolio.Web.Services;

/// <summary>
/// Sends through the Resend HTTP API when Email:ResendApiKey is set,
/// otherwise through SMTP (e.g. Gmail with an app password) when Email:Smtp:Host is set.
/// </summary>
public class EmailSender : IEmailSender
{
    private readonly HttpClient _http;
    private readonly EmailOptions _options;
    private readonly ILogger<EmailSender> _logger;

    public EmailSender(HttpClient http, IOptions<EmailOptions> options, ILogger<EmailSender> logger)
    {
        _http = http;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<bool> SendAsync(string subject, string htmlBody, string? replyTo, CancellationToken cancellationToken = default)
    {
        try
        {
            if (!string.IsNullOrWhiteSpace(_options.ResendApiKey))
                return await SendWithResendAsync(subject, htmlBody, replyTo, cancellationToken);

            if (!string.IsNullOrWhiteSpace(_options.Smtp.Host))
                return await SendWithSmtpAsync(subject, htmlBody, replyTo, cancellationToken);

            _logger.LogWarning("No email provider configured; message stored in the database only.");
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Sending email failed");
            return false;
        }
    }

    private async Task<bool> SendWithResendAsync(string subject, string htmlBody, string? replyTo, CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails")
        {
            Content = JsonContent.Create(new
            {
                from = _options.From,
                to = new[] { _options.To },
                subject,
                html = htmlBody,
                reply_to = replyTo,
            }),
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ResendApiKey);

        using var response = await _http.SendAsync(request, cancellationToken);
        if (response.IsSuccessStatusCode) return true;

        _logger.LogError("Resend returned {Status}: {Body}", (int)response.StatusCode, await response.Content.ReadAsStringAsync(cancellationToken));
        return false;
    }

    private async Task<bool> SendWithSmtpAsync(string subject, string htmlBody, string? replyTo, CancellationToken cancellationToken)
    {
        var smtp = _options.Smtp;
        using var client = new SmtpClient(smtp.Host, smtp.Port)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential(smtp.User, smtp.Password),
        };
        using var mail = new MailMessage(smtp.User ?? _options.To, _options.To, subject, htmlBody) { IsBodyHtml = true };
        if (!string.IsNullOrWhiteSpace(replyTo)) mail.ReplyToList.Add(replyTo);

        await client.SendMailAsync(mail, cancellationToken);
        return true;
    }
}
