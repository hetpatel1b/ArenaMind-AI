const fs = require('fs');
const path = require('path');

const modules = ['mobility', 'cameras', 'workforce', 'reports', 'infrastructure', 'audit', 'incidents', 'crowd'];

const template = (mod) => `import { NextRequest } from 'next/server';
import { createRouteHandler } from '@/lib/api/route-factory';
import { parseQueryParams } from '@/lib/api/dto';
import { successResponse, paginatedResponse } from '@/lib/api/response';
import { ${mod}Service } from '@/lib/modules/${mod}/service';

export const GET = createRouteHandler(async (req: NextRequest, { bizContext }) => {
  const url = new URL(req.url);
  const query = parseQueryParams(url.searchParams);
  
  // Assumes every service has a list method (might need adjustment per module)
  const result = await ${mod}Service.listSnapshots 
    ? await ${mod}Service.listSnapshots(bizContext, query.filters?.matchId || 'all', query)
    : await (${mod}Service as any).findAll?.(bizContext, query);
    
  return paginatedResponse(result?.data || [], result?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 });
});
`;

modules.forEach(mod => {
  const dir = path.join(process.cwd(), 'src', 'app', 'api', 'v1', mod);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, 'route.ts'), template(mod));
  console.log('Created route for', mod);
});
