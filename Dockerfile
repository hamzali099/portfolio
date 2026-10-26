# 1) Build the React app into Portfolio.Web/wwwroot/app
FROM node:20-alpine AS client
WORKDIR /src
COPY ClientApp/package*.json ClientApp/
RUN cd ClientApp && npm ci
COPY ClientApp/ ClientApp/
COPY Portfolio.Web/Data/ Portfolio.Web/Data/
RUN cd ClientApp && npm run build

# 2) Publish the ASP.NET Core app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY Portfolio.Web/Portfolio.Web.csproj Portfolio.Web/
RUN dotnet restore Portfolio.Web/Portfolio.Web.csproj
COPY Portfolio.Web/ Portfolio.Web/
COPY --from=client /src/Portfolio.Web/wwwroot/app Portfolio.Web/wwwroot/app
RUN dotnet publish Portfolio.Web/Portfolio.Web.csproj -c Release -o /app -p:SkipClientBuild=true

# 3) Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "Portfolio.Web.dll"]
