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

    public async Task<EmailResult> SendAsync(string subject, string htmlBody, string? replyTo, CancellationToken cancellationToken = default)
    {
        var provider = !string.IsNullOrWhiteSpace(_options.ResendApiKey) ? "Resend"
            : !string.IsNullOrWhiteSpace(_options.Smtp.Host) ? "SMTP"
            : "None";
        try
        {
            if (!string.IsNullOrWhiteSpace(_options.ResendApiKey))
                return await SendWithResendAsync(subject, htmlBody, replyTo, cancellationToken);

            if (!string.IsNullOrWhiteSpace(_options.Smtp.Host))
                return await SendWithSmtpAsync(subject, htmlBody, replyTo, cancellationToken);

            const string notConfigured = "No email provider configured. Set Email__ResendApiKey (or the Email__Smtp__* settings).";
            _logger.LogWarning(notConfigured);
            return new EmailResult(false, provider, notConfigured);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Sending email via {Provider} failed", provider);
            return new EmailResult(false, provider, ex.Message);
        }
    }

    private async Task<EmailResult> SendWithResendAsync(string subject, string htmlBody, string? replyTo, CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails")
        {
            Content = JsonContent.Create(new
            {
                from = _options.From,
                to = new[] { _options.To },
                subject,
                html = htmlBody,
                reply_to = string.IsNullOrWhiteSpace(replyTo) ? null : new[] { replyTo },
            }, options: new System.Text.Json.JsonSerializerOptions { DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull }),
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ResendApiKey);

        using var response = await _http.SendAsync(request, cancellationToken);
        if (response.IsSuccessStatusCode) return new EmailResult(true, "Resend");

        var body = await response.Content.ReadAsStringAsync(cancellationToken);
        _logger.LogError("Resend returned {Status}: {Body}", (int)response.StatusCode, body);
        return new EmailResult(false, "Resend", $"Resend returned {(int)response.StatusCode}: {body}");
    }

    private async Task<EmailResult> SendWithSmtpAsync(string subject, string htmlBody, string? replyTo, CancellationToken cancellationToken)
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
        return new EmailResult(true, "SMTP");
    }
}
