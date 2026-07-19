const fs = require('fs');
const path = require('path');

function fixFile(filePath, replacements) {
  const fullPath = path.join(__dirname, '../', filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf-8');
    let original = content;
    for (const [search, replace] of replacements) {
      // Use split/join for simple global replacement
      content = content.split(search).join(replace);
    }
    
    // Add Prisma import if InputJsonValue is used
    if (content.includes('Prisma.InputJsonValue') && !content.includes('import { Prisma }')) {
        content = "import { Prisma } from '@prisma/client';\n" + content;
    }

    if (content !== original) {
      fs.writeFileSync(fullPath, content, 'utf-8');
      console.log('Fixed', filePath);
    }
  }
}

// 1. Prisma Repositories: payload is unknown -> payload is Record<string, unknown>
fixFile('src/lib/modules/incidents/repository.ts', [
  ['payload: unknown', 'payload: Record<string, unknown>'],
  ['updateData: unknown', 'updateData: Record<string, unknown>']
]);

// 2. AI Service filter
fixFile('src/lib/modules/ai/service.ts', [
  ['filter: unknown', 'filter: Record<string, unknown>']
]);

// 3. Provisioning & Settings (Prisma JSON)
fixFile('src/lib/modules/provisioning/service.ts', [
  [': unknown', ': Prisma.InputJsonValue'] // rough but maybe works
]);
fixFile('src/lib/modules/settings/service.ts', [
  ['value: unknown', 'value: Prisma.InputJsonValue']
]);

// 4. Users Service & DTO
fixFile('src/lib/modules/users/dto.ts', [
  ['z.unknown()', 'z.record(z.unknown())']
]);
fixFile('src/lib/modules/users/service.ts', [
  ['preferences: unknown', 'preferences: Prisma.InputJsonValue']
]);

// 5. GlobalErrorHandler
fixFile('src/lib/platform/errors/GlobalErrorHandler.ts', [
  ['responsePayload: unknown', 'responsePayload: Record<string, unknown>']
]);

// 6. AlertManager spread
fixFile('src/lib/platform/observability/AlertManager.ts', [
  ['context?: unknown', 'context?: Record<string, unknown>']
]);

// 7. Monitoring Service
fixFile('src/lib/platform/observability/MonitoringService.ts', [
  ['list: unknown', 'list: Record<string, unknown>']
]);

// 8. Validation Service
fixFile('src/lib/platform/security/ValidationService.ts', [
  ['e: unknown', 'e: Record<string, unknown>']
]);

// 9. Serialization
fixFile('src/lib/utils/serialization.ts', [
  ['res: unknown = {}', 'res: Record<string, unknown> = {}']
]);

// 10. Audit Service
fixFile('src/server/audit/audit.service.ts', [
  ['oldData?: unknown', 'oldData?: Prisma.InputJsonValue'],
  ['newData?: unknown', 'newData?: Prisma.InputJsonValue']
]);

// 11. Auth Service metadata error
fixFile('src/server/auth/auth.ts', [
  // The error in auth.ts was about assigning to Prisma Json
  ['metadata.activeTokens = validTokens;', 'metadata.activeTokens = validTokens as Prisma.InputJsonValue;'],
  ['metadata.activeTokens = updatedTokens;', 'metadata.activeTokens = updatedTokens as Prisma.InputJsonValue;']
]);

// 12. Organization & User Service
fixFile('src/server/services/organization.service.ts', [
  ['data: unknown', 'data: Record<string, unknown>']
]);
fixFile('src/server/services/user.service.ts', [
  ['data: unknown', 'data: Record<string, unknown>']
]);

// 13. Transport service
fixFile('src/lib/modules/transport/service.ts', [
  ['t: unknown', 't: Record<string, unknown>']
]);

// 14. auth-provider.tsx ESLint any
fixFile('src/components/providers/auth-provider.tsx', [
  [': any', ': unknown']
]);

// 15. api-client.ts ESLint any
fixFile('src/lib/api-client/apiClient.ts', [
  [': any', ': unknown']
]);

// 16. mutations.ts ESLint any
fixFile('src/lib/api-client/mutations.ts', [
  [': any', ': unknown']
]);

// 17. dto.ts ESLint any
fixFile('src/lib/api/dto.ts', [
  [': any', ': unknown']
]);

// 18. match / incident repository interfaces ESLint any
fixFile('src/lib/domain/repositories/incident.repository.interface.ts', [
  ['any, any', 'unknown, unknown']
]);
fixFile('src/lib/domain/repositories/match.repository.interface.ts', [
  ['any, any', 'unknown, unknown']
]);

// 19. Cache Service
fixFile('src/lib/enterprise/ai/cache/response-cache.service.ts', [
  [': any', ': unknown']
]);

// 20. Orchestrator Service
fixFile('src/lib/enterprise/ai/multi-agent/orchestrator.service.ts', [
  [': any', ': unknown']
]);

// 21. AI Types
fixFile('src/lib/enterprise/ai/types.ts', [
  [': any', ': unknown']
]);

// 22. Event Dispatcher
fixFile('src/lib/infrastructure/events/event-dispatcher.ts', [
  [': any', ': unknown']
]);

// 23. Queue
fixFile('src/lib/infrastructure/queue/memory-queue.ts', [
  [': any', ': unknown']
]);
fixFile('src/lib/infrastructure/queue/queue.interface.ts', [
  [': any', ': unknown']
]);

// 24. Accessibility
fixFile('src/lib/modules/accessibility/repository.ts', [
  ['any, any', 'unknown, unknown']
]);

// 25. Job Interface
fixFile('src/lib/infrastructure/jobs/job.interface.ts', [
  [': any', ': unknown']
]);
