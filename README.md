## LambdaPulse Lens

LambdaPulse Lens is a self-hosted dashboard monitoring the engine powering it ([LambdaPulse](https://github.com/MatejRefka/LambdaPulse)). It provides visibility into how each middleware handles a HTTP request as it moves through the server pipeline.

## Project Highlights

- Real-time server telemetry via Server Side Events.
- NGINX and Redis wired into the middleware pipeline for HTTPS redirection and response caching
- Containerized deployment to AWS EC2 using ECR, with releases through GitHub Actions and OIDC
- Observability with Grafana, Loki, Alloy, and CloudWatch

## Live Application

[lambdapulse.app](https://lambdapulse.app)

## Demos

Static Files middleware serves the requested image, short-circuiting the remaining pipeline.

https://github.com/user-attachments/assets/b5455e5c-e802-46d6-8080-32f5ca3e1d4b

First request is a cache miss. Cache middleware builds a cache key and caches the response. Following requests are a cache hit and the cached response is served.

https://github.com/user-attachments/assets/91624e08-5e11-4b1c-89ef-88bcd62816e9

User's endpoint throws an unhandled exception. Exception middleware catches the exception, protecting the server.

https://github.com/user-attachments/assets/50915b86-0144-41b6-af41-4bcf2e13c48e





