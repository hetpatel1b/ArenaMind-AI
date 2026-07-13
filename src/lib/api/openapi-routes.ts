import { z } from 'zod';
import { registry, ApiTags } from './openapi';
import { QueryParamsSchema } from './dto';
import { IncidentDtoSchema, CreateIncidentDtoSchema } from '@/lib/modules/incidents/dto';
import { ResourceDtoSchema } from '@/lib/modules/resources/dto';

// Standard Error Responses
const ErrorResponse = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
});

registry.registerComponent('responses', 'Unauthorized', {
  description: 'Missing or invalid bearer token',
  content: { 'application/json': { schema: ErrorResponse } },
});

registry.registerComponent('responses', 'NotFound', {
  description: 'Resource not found or outside tenant scope',
  content: { 'application/json': { schema: ErrorResponse } },
});

// Paths registration
registry.registerPath({
  method: 'get',
  path: '/api/v1/matches/{id}/incidents',
  tags: [ApiTags.INCIDENTS],
  summary: 'List Match Incidents',
  description: 'Retrieve a paginated, filterable list of incidents for a specific match.',
  request: {
    params: z.object({ id: z.string().uuid() }),
    query: QueryParamsSchema,
  },
  responses: {
    200: {
      description: 'Paginated list of incidents',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.array(IncidentDtoSchema),
            meta: z.object({
              total: z.number(),
              page: z.number(),
              limit: z.number(),
              totalPages: z.number(),
            }),
          }),
        },
      },
    },
    401: { $ref: '#/components/responses/Unauthorized' },
    404: { $ref: '#/components/responses/NotFound' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/matches/{id}/incidents',
  tags: [ApiTags.INCIDENTS],
  summary: 'Create Incident',
  description: 'Report a new incident during a match.',
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { 'application/json': { schema: CreateIncidentDtoSchema } },
    },
  },
  responses: {
    200: {
      description: 'Incident created successfully',
      content: {
        'application/json': {
          schema: z.object({ success: z.literal(true), data: IncidentDtoSchema }),
        },
      },
    },
    401: { $ref: '#/components/responses/Unauthorized' },
    404: { $ref: '#/components/responses/NotFound' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/matches/{id}/resources',
  tags: [ApiTags.RESOURCES],
  summary: 'List Match Resources',
  description: 'Retrieve paginated resources (staff, equipment) allocated to the match.',
  request: {
    params: z.object({ id: z.string().uuid() }),
    query: QueryParamsSchema,
  },
  responses: {
    200: {
      description: 'Paginated list of resources',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.array(ResourceDtoSchema),
          }),
        },
      },
    },
    401: { $ref: '#/components/responses/Unauthorized' },
  },
});

// Crowd
registry.registerPath({
  method: 'get',
  path: '/api/v1/matches/{id}/crowd',
  tags: [ApiTags.CROWD],
  summary: 'List Crowd Data',
  description: 'Retrieve paginated crowd telemetry.',
  request: { params: z.object({ id: z.string().uuid() }), query: QueryParamsSchema },
  responses: {
    200: { description: 'Success' },
    401: { $ref: '#/components/responses/Unauthorized' },
  },
});

// Alerts
registry.registerPath({
  method: 'get',
  path: '/api/v1/matches/{id}/alerts',
  tags: [ApiTags.ALERTS],
  summary: 'List Alerts',
  description: 'Retrieve paginated alerts.',
  request: { params: z.object({ id: z.string().uuid() }), query: QueryParamsSchema },
  responses: {
    200: { description: 'Success' },
    401: { $ref: '#/components/responses/Unauthorized' },
  },
});

// Accessibility
registry.registerPath({
  method: 'get',
  path: '/api/v1/matches/{id}/accessibility',
  tags: [ApiTags.ACCESSIBILITY],
  summary: 'List Accessibility Requests',
  description: 'Retrieve paginated accessibility requests.',
  request: { params: z.object({ id: z.string().uuid() }), query: QueryParamsSchema },
  responses: {
    200: { description: 'Success' },
    401: { $ref: '#/components/responses/Unauthorized' },
  },
});

// Reports
registry.registerPath({
  method: 'get',
  path: '/api/v1/matches/{id}/reports',
  tags: [ApiTags.REPORTS],
  summary: 'List Reports',
  description: 'Retrieve paginated reports.',
  request: { params: z.object({ id: z.string().uuid() }), query: QueryParamsSchema },
  responses: {
    200: { description: 'Success' },
    401: { $ref: '#/components/responses/Unauthorized' },
  },
});

// Call this file somewhere in the boot sequence or route generation to ensure it runs
export const routesRegistered = true;
