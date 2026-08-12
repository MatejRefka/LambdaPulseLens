ARG NODE_VERSION=24.19.0
ARG DOTNET_SDK_VERSION=10.0.400
ARG DOTNET_RUNTIME_VERSION=10.0.11

#use node image
FROM node:${NODE_VERSION}-bookworm-slim AS ui-build

#set working dir
WORKDIR /src/LambdaPulseLens.UI

#prevent reinstalling every npm dependency if unchanged
COPY src/LambdaPulseLens.UI/package.json ./
COPY src/LambdaPulseLens.UI/package-lock.json ./

RUN npm ci

#copy UI files
COPY src/LambdaPulseLens.UI/ ./
#need the .csproj for the server version
COPY src/LambdaPulseLens.Server/LambdaPulseLens.Server.csproj /src/LambdaPulseLens.Server/

RUN npm run build


#use .net10 sdk image
FROM mcr.microsoft.com/dotnet/sdk:${DOTNET_SDK_VERSION}-noble AS server-build

#set working dir
WORKDIR /src/LambdaPulseLens.Server

#prevent reinstalling every package if unchanged
COPY src/LambdaPulseLens.Server/LambdaPulseLens.Server.csproj ./

RUN dotnet restore

#copy server files
COPY src/LambdaPulseLens.Server/ ./

#copy from ui-build -the UI output in wwwroot
COPY --from=ui-build /src/LambdaPulseLens.Server/wwwroot ./wwwroot

#publish the app
RUN dotnet publish -c Release -o /app/publish --no-restore


#use .net10 runtime image
FROM mcr.microsoft.com/dotnet/runtime:${DOTNET_RUNTIME_VERSION}-noble AS final

#set working dir for the app
WORKDIR /app

#copy the published app
COPY --from=server-build /app/publish ./

#use 'app' user instead of 'root' user
USER $APP_UID

#image expects the app to listen on 8080
EXPOSE 8080

#start LambdaPulseLens.Server.dll process when a container is created from this image
ENTRYPOINT ["dotnet", "LambdaPulseLens.Server.dll"]
