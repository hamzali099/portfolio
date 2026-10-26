# Ali Hamza — Portfolio (React + ASP.NET Core MVC)

Personal portfolio built from my LinkedIn profile.

- **Backend:** ASP.NET Core 8 MVC. It hosts the site and serves `GET /api/profile` and `POST /api/contact`.
- **Frontend:** React 18 + Vite, built into `Portfolio.Web/wwwroot/app`.

## Structure
```
Portfolio.Web/              ASP.NET Core MVC app
  Controllers/HomeController.cs        renders Views/Home/Index (React host + SEO meta)
  Controllers/Api/ProfileController.cs GET  /api/profile
  Controllers/Api/ContactController.cs POST /api/contact (validated, saved to App_Data/messages.jsonl)
  Data/profile.json                    <- edit your content here
  Services/                            profile + contact services (DI)
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

## Deploy (free)

### Option A: Render (Docker)
1. Push this folder to a GitHub repository.
2. On https://render.com create a **New → Web Service**, connect the repo, and choose **Docker** as the runtime (it uses the `Dockerfile` at the root).
3. Pick the **Free** instance type and deploy. Your site gets a `https://<name>.onrender.com` URL.

Free services sleep after inactivity, so the first visit after a while takes a few extra seconds. The disk is not permanent, so contact messages saved to `App_Data` are lost on redeploy (switch `FileContactService` to email to keep them).

### Option B: MonsterASP.NET (native ASP.NET Core hosting)
1. Create a free account and website at https://www.monsterasp.net.
2. Build: `cd ClientApp && npm install && npm run build`, then `cd ../Portfolio.Web && dotnet publish -c Release -o publish -p:SkipClientBuild=true`.
3. Upload the contents of `Portfolio.Web/publish` with the FTP or Web Deploy details from their control panel.
