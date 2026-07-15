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

  // State Machine Progression for demo purposes
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (phase === 'MONITORING') {
      timeout = setTimeout(() => setPhase('ANALYZING'), 6000 + Math.random() * 4000);
    } else if (phase === 'ANALYZING') {
      timeout = setTimeout(() => setPhase('REASONING'), 5000 + Math.random() * 3000);
    } else if (phase === 'REASONING') {
      timeout = setTimeout(() => setPhase('AWAITING_APPROVAL'), 5000 + Math.random() * 3000);
    } else if (phase === 'EXECUTING') {
      timeout = setTimeout(() => setPhase('COMPLETED'), 3000 + Math.random() * 2000);
    } else if (phase === 'COMPLETED') {
      timeout = setTimeout(() => setPhase('MONITORING'), 8000 + Math.random() * 4000);
    }

    return () => clearTimeout(timeout);
  }, [phase]);

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
