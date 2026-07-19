# Configuration System

ArenaMind utilizes a centralized configuration system (`ConfigurationService`) coupled with strict validation (`EnvironmentValidator`).

## Centralized Configuration

Direct access to `process.env` is restricted. Use the `ConfigurationService` located at `src/lib/platform/config/ConfigurationService.ts`.

```typescript
import { config } from '@/lib/platform/config/ConfigurationService';
console.log(config.databaseUrl);
```

## Validation Schema

On startup, ArenaMind strictly validates the presence and formatting of required variables. If any variables are invalid, the `EnvironmentValidator` produces comprehensive diagnostics and halts the application in production.

## Required Variables

- `DATABASE_URL`: PostgreSQL connection string.
- `NEXTAUTH_SECRET`: Secret for securing JWTs and sessions.
- `GROK_API_KEY`: API key for Grok.
- `GEMINI_API_KEY`: API key for Gemini.
- `REDIS_URL`: Redis connection string.
