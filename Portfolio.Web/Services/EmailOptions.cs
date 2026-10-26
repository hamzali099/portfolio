namespace Portfolio.Web.Services;

public class EmailOptions
{
    /// <summary>Where contact messages are delivered.</summary>
    public string To { get; set; } = "hamzacodes0@gmail.com";

    /// <summary>Resend API key (https://resend.com). Preferred: works on hosts that block SMTP.</summary>
    public string? ResendApiKey { get; set; }

    public string From { get; set; } = "Portfolio <onboarding@resend.dev>";

    public SmtpOptions Smtp { get; set; } = new();
}

public class SmtpOptions
{
    public string? Host { get; set; }
    public int Port { get; set; } = 587;
    public string? User { get; set; }
    public string? Password { get; set; }
}
