import React, { memo } from 'react';
import { MobilitySidebar, TransportHealth } from './MobilitySidebar';
import { MobilityCenter } from './MobilityCenter';
import { MobilityRightWorkspace } from './MobilityRightWorkspace';
import { useMobilityContext } from './MobilityContext';
import { motion, useReducedMotion } from 'framer-motion';
import { MobilityEngineState } from './MobilityTypes';

export interface MobilityContentWorkspaceProps {
  engine: MobilityEngineState;
  sidebarData: {
    metro: TransportHealth;
    bus: TransportHealth;
    road: TransportHealth;
    parking: TransportHealth;
    rideShare: TransportHealth;
    emergency: TransportHealth;
    accessibility: TransportHealth;
  };
}

export const MobilityContentWorkspace = memo(function MobilityContentWorkspace({
  sidebarData,
  engine,
}: MobilityContentWorkspaceProps) {
  const { state, actions } = useMobilityContext();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
        minWidth: 0,
        minHeight: 0,
      }}
    >
      <MobilitySidebar data={sidebarData} isCollapsed={state.sidebarCollapsed} />

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, zIndex: 1 }}
      >
        <MobilityCenter engine={engine} />
      </motion.div>

      <MobilityRightWorkspace
        mode={state.workspaceMode}
        onClose={() => actions.setMode('NONE')}
        engine={engine}
      />
    </div>
  );
});
