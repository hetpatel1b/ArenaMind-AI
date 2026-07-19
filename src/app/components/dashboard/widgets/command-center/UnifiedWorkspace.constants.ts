export const workspaceVariants = {
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
