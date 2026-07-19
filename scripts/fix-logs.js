const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // If it imports LoggerService already, great, otherwise we need to inject it
  if (content.includes('console.log(') || content.includes('console.warn(') || content.includes('console.error(')) {
    if (!content.includes('LoggerService')) {
       // Just insert it after the last import, or at the top
       const importStatement = "import { LoggerService } from '@/lib/platform/observability/LoggerService';\n";
       const lastImportIndex = content.lastIndexOf('import ');
       if (lastImportIndex !== -1) {
          const endOfImport = content.indexOf('\n', lastImportIndex);
          content = content.slice(0, endOfImport + 1) + importStatement + content.slice(endOfImport + 1);
       } else {
          content = importStatement + content;
       }
    }
    content = content.replace(/console\.log\(/g, 'LoggerService.info(');
    content = content.replace(/console\.warn\(/g, 'LoggerService.warn(');
    content = content.replace(/console\.error\(/g, 'LoggerService.error(');
    
    // Remove eslint-disable-next-line no-console
    content = content.replace(/\/\/\s*eslint-disable-next-line\s*no-console\r?\n/g, '');
  }

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
    } else if (stat.isFile() && (filePath.endsWith('.ts') || filePath.endsWith('.tsx'))) {
      if (!filePath.includes('LoggerService.ts') && !filePath.includes('GlobalErrorHandler.ts')) {
         processFile(filePath);
      }
    }
  }
}

walkSync(path.join(__dirname, '../src/lib/enterprise/ai'));
walkSync(path.join(__dirname, '../src/lib/infrastructure/jobs'));
