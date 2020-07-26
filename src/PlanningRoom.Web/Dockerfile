FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
# EXPOSE 80
# EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src

# install NodeJS 13.x
# see https://github.com/nodesource/distributions/blob/master/README.md#deb
RUN apt-get update -yq 
RUN apt-get install curl gnupg -yq 
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt-get install -y nodejs

COPY ClientApp/package.json PlanningRoom.Web/ClientApp/
COPY ClientApp/package-lock.json PlanningRoom.Web/ClientApp/
WORKDIR "/src/PlanningRoom.Web/ClientApp"
RUN npm ci

WORKDIR /src

COPY PlanningRoom.Web.csproj PlanningRoom.Web/
RUN dotnet restore "PlanningRoom.Web/PlanningRoom.Web.csproj"
COPY . ./PlanningRoom.Web
WORKDIR "/src/PlanningRoom.Web"
RUN dotnet build "PlanningRoom.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PlanningRoom.Web.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# ENTRYPOINT ["dotnet", "PlanningRoom.Web.dll"]
# heroku uses the following
CMD ASPNETCORE_URLS=http://*:$PORT dotnet PlanningRoom.Web.dll