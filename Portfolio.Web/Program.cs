using System.Threading.RateLimiting;
using Microsoft.AspNetCore.HttpOverrides;
using Portfolio.Web.Data;
using Portfolio.Web.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddPortfolioDatabase(builder.Configuration, builder.Environment);
builder.Services.Configure<EmailOptions>(builder.Configuration.GetSection("Email"));
builder.Services.AddHttpClient<IEmailSender, EmailSender>();
builder.Services.AddSingleton<IProfileService, JsonProfileService>();
builder.Services.AddScoped<IContactService, ContactService>();

// Hosting platforms (Render, Azure) sit behind a proxy; trust its forwarded client IP and scheme
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// Limit each form to 5 submissions per 10 minutes per visitor IP
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("submissions", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            $"{context.Connection.RemoteIpAddress}|{context.Request.Path}",
            _ => new FixedWindowRateLimiterOptions { PermitLimit = 5, Window = TimeSpan.FromMinutes(10) }));
});

builder.Services.AddCors(options =>
{
    // Allows the Vite dev server (npm run dev) to call the API during development
    options.AddPolicy("DevClient", policy =>
        policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.EnsureCreated();
}

app.UseForwardedHeaders();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseRateLimiter();

if (app.Environment.IsDevelopment())
{
    app.UseCors("DevClient");
}

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
