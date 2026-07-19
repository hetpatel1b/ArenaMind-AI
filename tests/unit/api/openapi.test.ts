import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { registry, registerSchema, generateOpenApiDocument, ApiTags } from '@/lib/api/openapi';

describe('OpenAPI Utilities', () => {
  it('exports correct ApiTags', () => {
    expect(ApiTags.INCIDENTS).toBe('Incidents');
    expect(ApiTags.AUTH).toBe('Authentication');
  });

  it('registers a schema successfully', () => {
    const TestSchema = z.object({ id: z.string() });
    const registered = registerSchema('TestSchema', TestSchema);
    expect(registered).toBeDefined();

    // Check if the registry has the definition
    expect(registry.definitions.length).toBeGreaterThan(0);
  });

  it('generates a valid OpenAPI document', () => {
    const doc = generateOpenApiDocument() as {
      openapi: string;
      info: { title: string };
      servers?: Array<{ url: string; description: string }>;
      components?: {
        securitySchemes?: {
          bearerAuth?: unknown;
        };
      };
      security?: unknown[];
    };

    expect(doc.openapi).toBe('3.1.0');
    expect(doc.info.title).toBe('ArenaMind AI Operations API');
    expect(doc.servers?.length).toBeGreaterThan(0);
    expect(doc.components?.securitySchemes?.bearerAuth).toBeDefined();
    expect(doc.security).toEqual([{ bearerAuth: [] }]);
  });
});
