## LambdaPulse Lens

LambdaPulse Lens is a self-hosted dashboard monitoring the engine powering it ([LambdaPulse](https://github.com/MatejRefka/LambdaPulse)). It provides visibility into how each middleware handles a HTTP request as it moves through the server pipeline.

## Project Highlights

- Real-time server telemetry via Server Side Events.
- NGINX and Redis wired into the middleware pipeline for HTTPS redirection and response caching
- Containerized deployment to AWS EC2 using ECR, with releases through GitHub Actions and OIDC
- Observability with Grafana, Loki, Alloy, and CloudWatch

## Live Application

[lambdapulse.app](https://lambdapulse.app)

> **Beta:** LambdaPulse Lens is under active development.
