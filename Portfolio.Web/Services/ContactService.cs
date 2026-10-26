using System.Net;
using Portfolio.Web.Data;
using Portfolio.Web.Models;

namespace Portfolio.Web.Services;

/// <summary>Saves each contact message to the database and emails it to the site owner.</summary>
public class ContactService : IContactService
{
    private readonly AppDbContext _db;
    private readonly IEmailSender _email;

    public ContactService(AppDbContext db, IEmailSender email)
    {
        _db = db;
        _email = email;
    }

    public async Task<bool> SendAsync(ContactMessage message, CancellationToken cancellationToken = default)
    {
        var record = new ContactRecord
        {
            Name = message.Name.Trim(),
            Email = message.Email.Trim(),
            Subject = message.Subject?.Trim(),
            Message = message.Message.Trim(),
        };
        _db.ContactMessages.Add(record);
        await _db.SaveChangesAsync(cancellationToken);

        var subject = $"Portfolio contact: {(string.IsNullOrWhiteSpace(record.Subject) ? record.Name : record.Subject)}";
        record.EmailSent = (await _email.SendAsync(subject, BuildBody(record), record.Email, cancellationToken)).Sent;
        await _db.SaveChangesAsync(cancellationToken);

        return record.EmailSent;
    }

    private static string BuildBody(ContactRecord r)
    {
        string E(string? s) => WebUtility.HtmlEncode(s ?? "");
        return $"""
            <div style="font-family:Arial,sans-serif;max-width:600px">
              <h2 style="color:#0a2540">New message from your portfolio</h2>
              <p><strong>Name:</strong> {E(r.Name)}<br>
                 <strong>Email:</strong> <a href="mailto:{E(r.Email)}">{E(r.Email)}</a><br>
                 <strong>Subject:</strong> {E(r.Subject)}</p>
              <div style="padding:16px;background:#f5f7fb;border-left:4px solid #0a2540;white-space:pre-wrap">{E(r.Message)}</div>
              <p style="color:#64748b;font-size:12px">Reply to this email to answer {E(r.Name)} directly.</p>
            </div>
            """;
    }
}
