# Health Endpoints

ArenaMind exposes standard health endpoints for orchestrators (like Kubernetes or Docker Compose).

## Endpoints

### `GET /api/v1/health`

Returns comprehensive health details, including DB, Redis, Storage, AI providers, and system metrics.

- **200 OK**: Fully healthy.
- **503 Service Unavailable**: Critical dependency is unreachable.

### `GET /api/v1/live`

Liveness probe. Always returns 200 OK if the Node process is running and responding to requests.

### `GET /api/v1/ready`

Readiness probe. Returns 200 OK if dependencies are ready to serve requests. Returns 503 if not ready.

### `GET /api/v1/metrics`

Returns application-level metrics such as uptime, memory, CPU, and AI provider status.

## Usage in Docker Compose

Health endpoints are utilized by the `healthcheck` definition in `docker-compose.yml`.
