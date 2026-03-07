FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY src/HireWave.API/*.csproj ./src/HireWave.API/
RUN dotnet restore src/HireWave.API/HireWave.API.csproj
COPY . .
RUN dotnet publish src/HireWave.API/HireWave.API.csproj -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "HireWave.API.dll"]
