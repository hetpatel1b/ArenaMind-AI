import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useDemoState } from '@/lib/demo/useDemoState';

export type CopilotPhase =
  'MONITORING' | 'ANALYZING' | 'REASONING' | 'AWAITING_APPROVAL' | 'EXECUTING' | 'COMPLETED';

export function useCopilotState() {
  const pathname = usePathname();
  const demoState = useDemoState();
  const [phase, setPhase] = useState<CopilotPhase>('MONITORING');
  const [contextName, setContextName] = useState('Global Operations');

  const [prevPathname, setPrevPathname] = useState(pathname);

  // Trigger copilot analysis when the demo state copilot reasoning changes
  const prevReasoning = useRef(demoState.copilot.reasoning);
  useEffect(() => {
    if (demoState.copilot.reasoning !== prevReasoning.current) {
      prevReasoning.current = demoState.copilot.reasoning;
      setPhase('ANALYZING');
    }
  }, [demoState.copilot.reasoning]);

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
      timeout = setTimeout(() => setPhase('ANALYZING'), 6000);
    } else if (phase === 'ANALYZING') {
      timeout = setTimeout(() => setPhase('REASONING'), 5000);
    } else if (phase === 'REASONING') {
      timeout = setTimeout(() => setPhase('AWAITING_APPROVAL'), 5000);
    } else if (phase === 'EXECUTING') {
      timeout = setTimeout(() => setPhase('COMPLETED'), 3000);
    } else if (phase === 'COMPLETED') {
      timeout = setTimeout(() => setPhase('MONITORING'), 8000);
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
