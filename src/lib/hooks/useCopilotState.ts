import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export type CopilotPhase =
  'MONITORING' | 'ANALYZING' | 'REASONING' | 'AWAITING_APPROVAL' | 'EXECUTING' | 'COMPLETED';

export function useCopilotState() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<CopilotPhase>('MONITORING');
  const [contextName, setContextName] = useState('Global Operations');

  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname && pathname !== prevPathname) {
    setPrevPathname(pathname);
    setPhase('MONITORING');
    if (pathname.includes('/incidents')) {
      setContextName('Security & Incidents');
    } else if (pathname.includes('/cameras')) {
      setContextName('Camera Network');
    } else if (pathname.includes('/map')) {
      setContextName('Spatial Deployments');
    } else if (pathname.includes('/crowd')) {
      setContextName('Crowd Analytics');
    } else if (pathname.includes('/workforce')) {
      setContextName('Workforce Management');
    } else if (pathname.includes('/governance')) {
      setContextName('Governance & Audit');
    } else {
      setContextName('Global Operations');
    }
  }

  const approveRecommendation = () => {
    if (phase === 'AWAITING_APPROVAL') {
      setPhase('EXECUTING');
    }
  };

  const rejectRecommendation = () => {
    if (phase === 'AWAITING_APPROVAL') {
      setPhase('COMPLETED');
    }
  };

  return {
    phase,
    contextName,
    approveRecommendation,
    rejectRecommendation,
  };
}
