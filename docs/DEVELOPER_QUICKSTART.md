# ArenaMind AI Developer Quickstart

Welcome to the ArenaMind AI Operations API. This guide will help you authenticate and make your first API request to integrate stadium operations into your internal applications.

## Base URL

The API is available at:

- **Production**: `https://api.arenamind.ai/api/v1`
- **Development**: `http://localhost:3000/api/v1`

## Authentication

All endpoints require a Bearer token issued by our Identity Provider (IdP).
Include the token in the `Authorization` header of your HTTP request.

```bash
Authorization: Bearer <your_jwt_token>
```

## Your First Request

Let's retrieve the incidents for a specific match:

```bash
curl -X GET "https://api.arenamind.ai/api/v1/matches/550e8400-e29b-41d4-a716-446655440000/incidents?status=open&severityTier=1" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Accept: application/json"
```

## Exploring the API

We provide a live Swagger UI dashboard where you can explore and test all available endpoints dynamically.

1. Start your local server (`npm run dev`).
2. Navigate to `http://localhost:3000/api/docs`.

For more details on pagination, filtering, and standard responses, see the [API Conventions Guide](./API_CONVENTIONS.md).
