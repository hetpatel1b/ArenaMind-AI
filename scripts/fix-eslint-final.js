const fs = require('fs');
const path = require('path');

function forceReplaceAny(filePath) {
  const fullPath = path.join(__dirname, '../', filePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf-8');
  
  // Blanket replace `any` where it matches word boundaries in types
  content = content.replace(/:\s*any\b/g, ': unknown');
  content = content.replace(/<any>/g, '<unknown>');
  content = content.replace(/<any\[\]>/g, '<unknown[]>');
  content = content.replace(/any\[\]/g, 'unknown[]');
  content = content.replace(/as any\b/g, 'as unknown');
  content = content.replace(/Record<string,\s*any>/g, 'Record<string, unknown>');
  content = content.replace(/Record<number,\s*any>/g, 'Record<number, unknown>');

  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log('Force removed any in', filePath);
}

const eslintFiles = [
  'src/components/providers/auth-provider.tsx',
  'src/lib/api-client/apiClient.ts',
  'src/lib/api-client/mutations.ts',
  'src/lib/api/dto.ts',
  'src/lib/enterprise/ai/cache/response-cache.service.ts',
  'src/lib/enterprise/ai/multi-agent/orchestrator.service.ts',
  'src/lib/enterprise/ai/types.ts',
  'src/lib/infrastructure/events/event-dispatcher.ts',
  'src/lib/infrastructure/jobs/job.interface.ts',
  'src/lib/infrastructure/queue/memory-queue.ts',
  'src/lib/infrastructure/queue/queue.interface.ts'
];

eslintFiles.forEach(forceReplaceAny);
