# Docker Documentation

ArenaMind provides Dockerfiles for both development and production environments.

## Dockerfiles

- `Dockerfile`: Production multi-stage build optimizing the final image by copying only the standalone Next.js build.
- `Dockerfile.dev`: Development image mapping volumes and running `next dev`.

## Docker Compose

- `docker-compose.yml`: Local development setup including Next.js, PostgreSQL, and Redis.
- `docker-compose.prod.yml`: Production deployment manifest with health checks, restart policies, and environment file linking.

## Commands

- **Local Dev**: `docker-compose up -d --build`
- **Production Build**: `docker build -t arenamind:latest -f Dockerfile .`
