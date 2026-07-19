# API Reference

## Standard Design

All APIs are located in `src/app/api/v1/*` and represent RESTful resources.

## Global Response Format

```json
{
  "status": "success",
  "data": { ... },
  "metadata": {
    "timestamp": "2026-07-17T12:00:00Z",
    "version": "1.0",
    "correlationId": "uuid-here",
    "path": "/api/v1/resource"
  }
}
```

## Endpoints

- **GET** `/api/v1/matches/active`: Fetch the currently active match for the user's tenant.
- **POST** `/api/v1/incidents/what-if`: Execute AI Copilot scenario simulations.
- **GET** `/api/v1/crowd/engine`: Get real-time crowd telemetry.
- **GET** `/api/v1/mobility/engine`: Get real-time mobility projections.

## Rate Limiting

APIs are protected using a Redis-backed sliding window rate limit.

- General APIs: 100 req / minute
- Real-time Engine APIs: 60 req / minute
