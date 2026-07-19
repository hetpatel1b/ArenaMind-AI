const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Repositories
  content = content.replace(/PrismaRepository<([^,]+),\s*any,\s*any>/g, 'PrismaRepository<$1, unknown, unknown>');
  
  // Zod
  content = content.replace(/z\.any\(\)/g, 'z.unknown()');
  
  // Record
  content = content.replace(/Record<string,\s*any>/g, 'Record<string, unknown>');
  
  // As any
  content = content.replace(/as any/g, 'as unknown');
  
  // : any -> : unknown (very basic)
  content = content.replace(/:\s*any\b/g, ': unknown');
  
  // <any> -> <unknown>
  content = content.replace(/<any>/g, '<unknown>');

  // <any[]> -> <unknown[]>
  content = content.replace(/<any\[\]>/g, '<unknown[]>');

  // (t: any) -> (t: unknown)
  content = content.replace(/\(\s*([a-zA-Z0-9_]+)\s*:\s*any\s*\)/g, '($1: unknown)');

  // args: any -> args: unknown
  content = content.replace(/args:\s*any/g, 'args: unknown');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
}

function walkSync(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkSync(filePath);
    } else if (stat.isFile() && (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) && !filePath.includes('auth.ts')) {
      // Exclude auth.ts to handle it carefully manually
      processFile(filePath);
    }
  }
}

walkSync(path.join(__dirname, '../src'));
