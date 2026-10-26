using Portfolio.Web.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddSingleton<IProfileService, JsonProfileService>();
builder.Services.AddSingleton<IContactService, FileContactService>();

builder.Services.AddCors(options =>
{
    // Allows the Vite dev server (npm run dev) to call the API during development
    options.AddPolicy("DevClient", policy =>
        policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

if (app.Environment.IsDevelopment())
{
    app.UseCors("DevClient");
}

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
