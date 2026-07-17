const fs = require('fs');
const path = require('path');

const files = [
  'd:/Het/ArenaMind-AI/src/app/components/crowd/foundation/components/CrowdCopilot.tsx',
  'd:/Het/ArenaMind-AI/src/app/components/incidents/foundation/IncidentCopilot.tsx',
  'd:/Het/ArenaMind-AI/src/app/components/mobility/widgets/MobilityPersistentCopilot.tsx',
  'd:/Het/ArenaMind-AI/src/app/components/camera/foundation/CameraCopilot.tsx',
  'd:/Het/ArenaMind-AI/src/app/components/workforce/foundation/WorkforceCopilot.tsx',
  'd:/Het/ArenaMind-AI/src/app/components/governance/foundation/GovernanceCopilot.tsx',
  'd:/Het/ArenaMind-AI/src/app/components/infrastructure/foundation/InfrastructureCopilot.tsx',
  'd:/Het/ArenaMind-AI/src/app/components/intelligence/foundation/IntelligenceCopilot.tsx',
  'd:/Het/ArenaMind-AI/src/app/components/intelligence/widgets/IntelligencePersistentCopilot.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/import \{ useCopilotChat \} from '.*hooks\/useCopilotChat';/g, "import { useCopilotChat } from '@/app/hooks/useCopilotChat';");
    content = content.replace(/import \{ CopilotChatInput \} from '.*shared\/copilot\/CopilotChatInput';/g, "import { CopilotChatInput } from '@/app/components/shared/copilot/CopilotChatInput';");
    content = content.replace(/import \{ CopilotUserMessage, CopilotProgressIndicator \} from '.*shared\/copilot\/CopilotMessageComponents';/g, "import { CopilotUserMessage, CopilotProgressIndicator } from '@/app/components/shared/copilot/CopilotMessageComponents';");
    
    // Fix TS7006 error: Parameter 'msg' implicitly has an 'any' type. (it's actually 'msg: any' or better yet, since useCopilotChat returns typed messages, fixing imports will fix the inference)
    // Wait, the inference will be fixed if useCopilotChat is properly resolved. So we might not need to cast `msg: any`.
    
    // Fix InfrastructureCopilot.tsx: selectedNodes -> selectedNode
    if (file.includes('InfrastructureCopilot')) {
      content = content.replace(/state\.selectedNodes/g, "state.selectedNode");
    }

    fs.writeFileSync(file, content);
  }
}
console.log('Imports fixed.');
