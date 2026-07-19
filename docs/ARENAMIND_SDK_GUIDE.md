# ArenaMind SDK Generation Guide

The ArenaMind AI OpenAPI specification (`/api/docs/openapi.json`) is strictly 3.1 compliant and fully compatible with the [OpenAPI Generator](https://openapi-generator.tech/).

## Generating a TypeScript Client

To generate a fully typed, Axios-based TypeScript SDK for your frontend or internal Node.js services:

1. Ensure the server is running to expose the JSON definition.
2. Use Docker or the OpenAPI CLI tool:

```bash
openapi-generator-cli generate \
  -i http://localhost:3000/api/docs/openapi.json \
  -g typescript-axios \
  -o ./sdks/typescript \
  --additional-properties=supportsES6=true,typescriptThreePlus=true
```

## Supported Languages

Since every DTO is strongly mapped from Zod via `@asteasolutions/zod-to-openapi`, you can generate native typed SDKs for:

- **TypeScript** (Axios, Fetch, React Query)
- **Python** (for data science & analytics)
- **Go** (for backend microservices)
- **Swift / Kotlin** (for mobile apps)
