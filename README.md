# Ali Hamza — Portfolio (React + ASP.NET Core MVC)

Personal portfolio built from my LinkedIn profile.

- **Backend:** ASP.NET Core 8 MVC + Entity Framework Core. It hosts the site and serves the API below.
- **Frontend:** React 18 + Vite, built into `Portfolio.Web/wwwroot/app`.

## Structure
```
Portfolio.Web/              ASP.NET Core MVC app
  Controllers/HomeController.cs        renders Views/Home/Index (React host + SEO meta)
  Controllers/Api/ProfileController.cs GET  /api/profile
  Controllers/Api/ContactController.cs POST /api/contact  (saved to the database + emailed to me)
  Controllers/Api/FeedbackController.cs GET/POST /api/feedback (public visitor comments & ratings)
  Data/profile.json                    <- edit your content here
  Data/AppDbContext.cs                 feedback + contact messages (SQLite locally, PostgreSQL in production)
  Services/                            profile, contact and email services (DI)
ClientApp/                  React app (Vite)
```

## Run
Requires .NET 8 SDK and Node 18+.

```bash
cd ClientApp && npm install && npm run build   # outputs to Portfolio.Web/wwwroot/app
cd ../Portfolio.Web && dotnet run              # https://localhost:7001
```

To develop the frontend with hot reload, run `dotnet run` in one terminal and `npm run dev` in `ClientApp` in another
(http://localhost:5173). Vite proxies `/api` calls to the .NET app.

To publish, run `dotnet publish -c Release`. It builds the React app automatically.

## Editing content
All text lives in `Portfolio.Web/Data/profile.json`: summary, rotating hero roles, stats, skills, experience, **projects** and education.

Each project looks like this (`github` / `demo` links show buttons when filled in; categories become filter tabs automatically):
```json
{
  "title": "My Project",
  "category": "Web App",
  "description": "What it does.",
  "tech": ["ASP.NET Core", "SQL Server"],
  "features": ["Feature one", "Feature two"],
  "github": "https://github.com/...",
  "demo": "https://...",
  "featured": true
}
```

The site has a light (white & navy) theme and a dark navy theme. Visitors switch with the moon/sun button, and the choice is remembered.

## Contact form email

Messages are emailed to `hamzacodes0@gmail.com` through [FormSubmit](https://formsubmit.co) straight from the browser, with no key or setup.
The **first** message sends an "Activate Form" email to that address; click the button once and every later message is delivered.
Messages are also saved in the database.

## Configuration (environment variables)

| Variable | Purpose |
|---|---|
| `Email__ResendApiKey` | Optional. API key from [resend.com](https://resend.com) for a second, server-side email copy. |
| `ConnectionStrings__Default` | PostgreSQL connection string, e.g. from [neon.tech](https://neon.tech) (free). Keeps feedback and messages permanently. Without it a local SQLite file is used, which free hosts wipe on every redeploy. |
| `AdminKey` | Any secret text. Lets you delete a spam comment: `curl -X DELETE https://<site>/api/feedback/<id> -H "X-Admin-Key: <key>"` |
| `Email__Smtp__Host`, `Email__Smtp__User`, `Email__Smtp__Password` | Alternative to Resend: Gmail SMTP (`smtp.gmail.com`) with a Google app password. Many free hosts block SMTP, so Resend is recommended. |

**Email not arriving?** With `AdminKey` set, open `https://<site>/api/contact/test?key=<AdminKey>` in a browser. It sends a test email and shows exactly what went wrong.

Forms are protected with a hidden honeypot field and a limit of 5 submissions per 10 minutes per visitor.

## Deploy (free)

### Option A: Render (Docker)
1. Push this folder to a GitHub repository.
2. On https://render.com create a **New → Web Service**, connect the repo, and choose **Docker** as the runtime (it uses the `Dockerfile` at the root).
3. Pick the **Free** instance type and deploy. Your site gets a `https://<name>.onrender.com` URL.

Free services sleep after inactivity, so the first visit after a while takes a few extra seconds. Set the environment variables above under **Environment** in the Render dashboard; without a database connection string, feedback is lost whenever the service redeploys or restarts.

### Option B: MonsterASP.NET (native ASP.NET Core hosting)
1. Create a free account and website at https://www.monsterasp.net.
2. Build: `cd ClientApp && npm install && npm run build`, then `cd ../Portfolio.Web && dotnet publish -c Release -o publish -p:SkipClientBuild=true`.
3. Upload the contents of `Portfolio.Web/publish` with the FTP or Web Deploy details from their control panel.
