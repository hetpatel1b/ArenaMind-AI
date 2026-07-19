'use client';

import React from 'react';
import { NavigationRoute } from '../../../lib/fan/types';
import { multilingualService } from '../../../lib/fan/localization/multilingual.service';
import { fanContextService } from '../../../lib/fan/context/fan-context.service';

interface Props {
  route: NavigationRoute | null;
  onClose: () => void;
}

export default function FanNavigationOverlay({ route, onClose }: Props) {
  const [lang, setLang] = React.useState(fanContextService.getContext().language);

  React.useEffect(() => {
    const handleLangChange = () => setLang(fanContextService.getContext().language);
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  if (!route) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px',
        padding: '24px',
        color: '#fff',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        zIndex: 50,
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
          {multilingualService.t('fan.navigation.title', lang)}
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '24px',
          }}
        >
          &times;
        </button>
      </div>

      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>FROM</div>
          <div style={{ fontWeight: 500 }}>{route.origin}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>TO</div>
          <div style={{ fontWeight: 500, color: '#38BDF8' }}>{route.destination}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div
          style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
          }}
        >
          ⏱ {route.estimatedTimeMinutes} min
        </div>
        {route.isAccessible && (
          <div
            style={{
              background: 'rgba(34,197,94,0.2)',
              color: '#4ade80',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '14px',
            }}
          >
            ♿ {multilingualService.t('nav.accessibility', lang)}
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
        <ol style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255,255,255,0.8)' }}>
          {route.pathSegments.map((seg, idx) => (
            <li key={idx} style={{ marginBottom: '8px' }}>
              {seg}
            </li>
          ))}
        </ol>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `,
        }}
      />
    </div>
  );
}
