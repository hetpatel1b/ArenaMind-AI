const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/app/components/dashboard/widgets/command-center');

// 1. Create constants
const constantsCode = `export const workspaceVariants = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -12, transition: { duration: 0.3 } },
};

export const WORKSPACE_LABELS = {
  COPILOT: 'Operations Copilot',
  MISSION: 'Mission',
  DETAILS: 'Details',
  INSPECTOR: 'Inspector',
  ANALYTICS: 'Executive Analytics',
};
`;
fs.writeFileSync(path.join(dir, 'UnifiedWorkspace.constants.ts'), constantsCode);

// 2. Read the massive UnifiedWorkspace.tsx
const originalFile = path.join(dir, 'UnifiedWorkspace.tsx');
let content = fs.readFileSync(originalFile, 'utf-8');

// Replace style={...} with className="..." for the main wrapper
content = content.replace(
  /style={{\s*display: 'flex',\s*flexDirection: 'column',\s*height: '100%',\s*backgroundColor: 'rgba\(5, 5, 5, 0\.5\)',\s*boxShadow: '-20px 0 60px rgba\(0,0,0,0\.3\)',\s*borderRadius: 'var\(--radius-xl\)',\s*overflow: 'hidden',\s*position: 'relative',\s*}}/g,
  'className="flex flex-col h-full bg-black/50 shadow-2xl rounded-2xl overflow-hidden relative"'
);

// Replace header styles
content = content.replace(
  /style={{\s*display: 'flex',\s*alignItems: 'center',\s*justifyContent: 'space-between',\s*padding: '16px 24px',\s*borderBottom: '1px solid rgba\(255,255,255,0\.05\)',\s*backgroundColor: 'rgba\(255,255,255,0\.02\)',\s*}}/g,
  'className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5"'
);

// We need to inject imports
const importIndex = content.indexOf("import { OperationLifecycle } from './OperationLifecycle';");
const newImports = `import { workspaceVariants, WORKSPACE_LABELS } from './UnifiedWorkspace.constants';\nimport { WorkspaceHeader } from './WorkspaceHeader';\n`;
content = content.slice(0, importIndex) + newImports + content.slice(importIndex);

// Replace workspaceVariants usage inside the file:
// We delete the local definition
content = content.replace(/const workspaceVariants = {[\s\S]*?};\s*/, '');

// Replace magic strings with WORKSPACE_LABELS
content = content.replace(/'Operations Copilot'/g, 'WORKSPACE_LABELS.COPILOT');
content = content.replace(/'Mission'/g, 'WORKSPACE_LABELS.MISSION');
content = content.replace(/'Details'/g, 'WORKSPACE_LABELS.DETAILS');
content = content.replace(/'Inspector'/g, 'WORKSPACE_LABELS.INSPECTOR');
content = content.replace(/'Executive Analytics'/g, 'WORKSPACE_LABELS.ANALYTICS');

// Replace style objects in spans
content = content.replace(/style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}/g, 'className="text-[13px] font-bold text-white"');
content = content.replace(/style={{ fontSize: '11px', color: 'var\(--text-tertiary\)' }}/g, 'className="text-[11px] text-gray-500"');
content = content.replace(/style={{ color: 'var\(--text-tertiary\)' }}/g, 'className="text-gray-500"');

// Fix the Analytics button style
content = content.replace(
  /style={{\s*fontSize: '11px',\s*color: 'var\(--ai-accent\)',\s*background: 'rgba\(10,132,255,0\.1\)',\s*border: '1px solid var\(--ai-accent\)',\s*borderRadius: '4px',\s*padding: '4px 8px',\s*cursor: 'pointer',\s*}}/g,
  'className="text-[11px] text-blue-500 bg-blue-500/10 border border-blue-500 rounded px-2 py-1 cursor-pointer"'
);

// Flex 1
content = content.replace(/style={{ flex: 1, position: 'relative', overflow: 'hidden' }}/g, 'className="flex-1 relative overflow-hidden"');

// Extract the header part to WorkspaceHeader.tsx if we want, or just leave it inlined but styled properly (since the prompt said "e.g., WorkspaceHeader" we should do it).
// It's easier to just do it via string replacement. 

fs.writeFileSync(originalFile, content);
console.log('UnifiedWorkspace updated with Tailwind and constants extracted.');
