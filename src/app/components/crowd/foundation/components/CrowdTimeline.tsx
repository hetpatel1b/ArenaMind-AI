import React from 'react';
import { motion } from 'framer-motion';

export function CrowdTimeline() {
  return (
    <div
      style={{
        width: '100%',
        height: '64px',
        background: 'var(--bg-app, #0F1115)',
        borderTop: '1px solid var(--border-subtle, #2A2E37)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '24px',
      }}
    >
      {/* Playback Controls */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <IconButton icon="play" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#ff453a' }}>LIVE / SURGE</span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>19:45:00</span>
        </div>
      </div>

      {/* Timeline Track */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Track Base */}
        <div
          style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '2px',
            position: 'relative',
          }}
        >
          {/* Past Fill */}
          <div
            style={{
              width: '60%',
              height: '100%',
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '2px 0 0 2px',
            }}
          />

          {/* Current Handle (Animated Line) */}
          <motion.div
            style={{
              position: 'absolute',
              left: '60%',
              top: '-10px',
              width: '2px',
              height: '24px',
              background: '#fff',
              boxShadow: '0 0 10px rgba(255,255,255,0.5)',
              zIndex: 10,
            }}
            animate={{
              boxShadow: [
                '0 0 10px rgba(255,255,255,0.5)',
                '0 0 20px rgba(255,255,255,0.8)',
                '0 0 10px rgba(255,255,255,0.5)',
              ],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-6px',
                left: '-5px',
                width: '12px',
                height: '12px',
                background: '#fff',
                borderRadius: '50%',
              }}
            />
          </motion.div>

          {/* Forecast Area */}
          <motion.div
            style={{
              position: 'absolute',
              left: '60%',
              top: 0,
              width: '40%',
              height: '100%',
              background:
                'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(62,130,247,0.2) 4px, rgba(62,130,247,0.2) 8px)',
              backgroundSize: '20px 20px',
              borderRadius: '0 2px 2px 0',
            }}
            animate={{ backgroundPosition: ['0px 0px', '20px 0px'] }}
            transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
          />

          {/* Intelligence Phases */}
          <PhaseMarker left="50%" label="Detected" />
          <PhaseMarker left="55%" label="Analyzing" />
          <PhaseMarker left="60%" label="Recommendation" type="active" />
          <PhaseMarker left="70%" label="Deployment" type="forecast" />
          <PhaseMarker left="85%" label="Recovery" type="forecast" />
        </div>
      </div>

      {/* Zoom / Speed Controls */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary, #A0A5B1)' }}>1x</div>
        <IconButton icon="zoom" />
      </div>
    </div>
  );
}

function PhaseMarker({
  left,
  label,
  type = 'past',
}: {
  left: string;
  label: string;
  type?: 'past' | 'active' | 'forecast';
}) {
  const color =
    type === 'active'
      ? '#3e82f7'
      : type === 'forecast'
        ? 'rgba(62,130,247,0.5)'
        : 'rgba(255,255,255,0.3)';

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      <motion.div
        animate={
          type === 'active'
            ? { boxShadow: [`0 0 0px transparent`, `0 0 15px ${color}`, `0 0 0px transparent`] }
            : {}
        }
        transition={{ repeat: Infinity, duration: 2 }}
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: color,
          border: '2px solid var(--bg-app)',
          boxShadow: type === 'active' ? `0 0 10px ${color}` : 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '16px',
          fontSize: '10px',
          color: type === 'active' ? '#fff' : 'var(--text-secondary)',
          whiteSpace: 'nowrap',
          fontWeight: type === 'active' ? 600 : 400,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function IconButton({ icon }: { icon: string }) {
  return (
    <div
      style={{
        width: '32px',
        height: '32px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#fff',
        fontSize: '12px',
      }}
    >
      {icon === 'play' && '▶'}
      {icon === 'zoom' && '🔍'}
    </div>
  );
}
