import { z } from 'zod';
import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from '@asteasolutions/zod-to-openapi';

// Extend Zod to support OpenAPI features
extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

export const ApiTags = {
  INCIDENTS: 'Incidents',
  CROWD: 'Crowd Intelligence',
  RESOURCES: 'Resources',
  DASHBOARD: 'Dashboard',
  AUTH: 'Authentication',
  REPORTS: 'Reports',
  ALERTS: 'Alerts',
  ACCESSIBILITY: 'Accessibility',
} as const;

// Register standard Bearer auth
const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

export function registerSchema<T extends z.ZodTypeAny>(name: string, schema: T): T {
  return registry.register(name, schema);
}

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV31(registry.definitions);

  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      version: '1.0.0',
      title: 'ArenaMind AI Operations API',
      description: 'Enterprise API for autonomous stadium management and live operations.',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local Development' },
      { url: 'https://api.arenamind.ai', description: 'Production Environment' },
    ],
    security: [{ bearerAuth: [] }],
  });
}
