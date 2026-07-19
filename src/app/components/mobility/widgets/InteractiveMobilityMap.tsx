'use client';

import React from 'react';

import { MobilityState } from '../MobilityCommandWorkspace';

interface InteractiveMobilityMapProps {
  zones: SafeAny[];
  mobilityState?: MobilityState;
}

export function InteractiveMobilityMap({ zones, mobilityState }: InteractiveMobilityMapProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: 'var(--space-4)', position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 'var(--text-md)',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          Mobility Network Map
        </h3>
        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          Live ingress/egress transit routes
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 'var(--space-4)',
          right: 'var(--space-4)',
          zIndex: 10,
          display: 'flex',
          gap: 'var(--space-3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: 'rgba(10, 132, 255, 1)' }} />
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Metro</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: 'rgba(255, 149, 0, 1)' }} />
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Shuttle</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              border: '2px solid rgba(255, 59, 48, 1)',
            }}
          />
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Hotspot</span>
        </div>
      </div>

      {/* Abstract Transit Representation */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '50%',
            height: '40%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.01)',
          }}
        >
          {/* Venue Marker */}
          <div
            style={{
              fontSize: '10px',
              color: 'var(--text-secondary)',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            STADIUM
          </div>

          {/* Metro Line North */}
          <div
            style={{
              position: 'absolute',
              top: '-60%',
              left: '50%',
              width: '4px',
              height: '60%',
              backgroundColor: 'rgba(10, 132, 255, 0.5)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '-4px',
                width: '12px',
                height: '12px',
                backgroundColor: 'rgba(10, 132, 255, 1)',
              }}
            />
          </div>

          {/* Metro Line South */}
          <div
            style={{
              position: 'absolute',
              bottom: '-60%',
              left: '50%',
              width: '4px',
              height: '60%',
              backgroundColor: 'rgba(10, 132, 255, 0.5)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: '-4px',
                width: '12px',
                height: '12px',
                backgroundColor: 'rgba(10, 132, 255, 1)',
              }}
            />
          </div>

          {/* Shuttle Loop */}
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              left: '-30%',
              width: '160%',
              height: '140%',
              border: '2px dashed rgba(255, 149, 0, 0.5)',
              borderRadius: '100px',
            }}
          />

          {/* Emergency Access Corridor */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '-80%',
              width: '80%',
              height: '8px',
              backgroundColor: 'rgba(52, 199, 89, 0.2)',
            }}
          >
            <span
              style={{
                position: 'absolute',
                right: '0',
                top: '-14px',
                fontSize: '8px',
                color: 'rgba(52, 199, 89, 1)',
              }}
            >
              EMERGENCY CLEAR
            </span>
          </div>

          {/* Dynamic Congestion Hotspot (North Metro) */}
          {mobilityState && mobilityState.metro.capacity > 85 && (
            <div
              style={{
                position: 'absolute',
                top: '-30%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 59, 48, 0.2)',
                border: '2px solid rgba(255, 59, 48, 1)',
                animation: 'pulse-map 2s infinite',
              }}
            />
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes pulse-map {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
      `,
        }}
      />
    </div>
  );
}
