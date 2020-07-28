FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src

# install NodeJS 12.x
# see https://github.com/nodesource/distributions/blob/master/README.md#deb
RUN apt-get update -yq
RUN apt-get install curl gnupg -yq
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs

COPY . ./PlanningRoom.Web

RUN dotnet publish "./PlanningRoom.Web/PlanningRoom.Web.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS final
WORKDIR /app
COPY --from=build /app/publish .

# ENTRYPOINT ["dotnet", "PlanningRoom.Web.dll"]
# Run using specified port
CMD ASPNETCORE_URLS=http://*:$PORT dotnet PlanningRoom.Web.dll