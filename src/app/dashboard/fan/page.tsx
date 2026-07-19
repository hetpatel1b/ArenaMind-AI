'use client';

import React from 'react';
import FanCopilotUI from '../../components/fan/FanCopilotUI';
import MultilingualSelector from '../../components/fan/MultilingualSelector';
import FanNavigationOverlay from '../../components/fan/FanNavigationOverlay';
import { NavigationRoute } from '../../../lib/fan/types';
import { fanContextService } from '../../../lib/fan/context/fan-context.service';
import { fanRecommendationsService } from '../../../lib/fan/recommendations/fan-recommendations.service';
import { multilingualService } from '../../../lib/fan/localization/multilingual.service';

export default function FanModePage() {
  const [activeRoute, setActiveRoute] = React.useState<NavigationRoute | null>(null);
  const [lang, setLang] = React.useState(fanContextService.getContext().language);
  const [recommendations, setRecommendations] = React.useState<SafeAny[]>([]);

  React.useEffect(() => {
    const handleLangChange = () => setLang(fanContextService.getContext().language);
    window.addEventListener('languageChanged', handleLangChange);

    // Load initial recommendations
    fanRecommendationsService.getRecommendations().then(setRecommendations);

    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const handleRouteReceived = (route: NavigationRoute) => {
    setActiveRoute(route);
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', color: '#fff' }}>
      <MultilingualSelector />

      {/* Left Area: Context & Recommendations (simulated map area in background) */}
      <div
        style={{
          flex: 1,
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '400px' }}>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 300,
              marginBottom: '8px',
              letterSpacing: '-1px',
            }}
          >
            ArenaMind
          </h1>
          <p style={{ fontSize: '18px', color: '#94a3b8', marginBottom: '48px' }}>
            {multilingualService.t('fan.welcome', lang)}
          </p>

          <h3
            style={{
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: '#64748b',
              marginBottom: '16px',
            }}
          >
            {multilingualService.t('fan.recommendations.title', lang)}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '20px',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                  transition: 'transform 0.2s, background 0.2s',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}
                >
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>{rec.title}</h4>
                  {rec.isAccessible && (
                    <span title="Accessible" style={{ color: '#4ade80' }}>
                      ♿
                    </span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', marginBottom: '12px' }}>
                  {rec.description}
                </p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#94a3b8' }}>
                  <span>🚶 {rec.distanceMinutes} min</span>
                  <span>⏳ {rec.queueTimeMinutes} min wait</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <FanNavigationOverlay route={activeRoute} onClose={() => setActiveRoute(null)} />
      </div>

      {/* Right Area: AI Copilot */}
      <div style={{ width: '450px', height: '100%', position: 'relative', zIndex: 10 }}>
        <FanCopilotUI onRouteReceived={handleRouteReceived} />
      </div>
    </div>
  );
}
