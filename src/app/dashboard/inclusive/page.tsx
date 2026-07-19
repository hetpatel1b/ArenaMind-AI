'use client';

import React from 'react';
import InclusiveCopilotUI from '../../components/inclusive/InclusiveCopilotUI';
import EmergencyAlertPanel from '../../components/inclusive/EmergencyAlertPanel';
import LostVisitorTracker from '../../components/inclusive/LostVisitorTracker';

import { inclusiveProfileService } from '../../../lib/inclusive/profiles/profile.service';
import { inclusiveRecommendationsService } from '../../../lib/inclusive/recommendations/inclusive-recommendations.service';
import { inclusiveEmergencyService } from '../../../lib/inclusive/emergency/emergency.service';
import { adaptiveNavigationService } from '../../../lib/inclusive/navigation/adaptive-navigation.service';
import {
  InclusiveProfile,
  AdaptiveRecommendation,
  EmergencyGuidance,
  AdaptiveNavigationRoute,
} from '../../../lib/inclusive/types';

export default function InclusivePage() {
  const [profile, setProfile] = React.useState<InclusiveProfile | null>(null);
  const [recommendations, setRecommendations] = React.useState<AdaptiveRecommendation[]>([]);
  const [emergency, setEmergency] = React.useState<EmergencyGuidance | null>(null);
  const [route, setRoute] = React.useState<AdaptiveNavigationRoute | null>(null);

  React.useEffect(() => {
    // In a real app, this might listen to context changes.
    // For the UI demonstration, we'll just load the current profile and associated adaptive data.
    const loadAdaptiveExperience = async () => {
      // We can simulate an extended condition here for demonstration purposes,
      // e.g., turning on "Lost Visitor" mode or "Wheelchair" mode without changing the core fan context.
      // inclusiveProfileService.simulateExtendedCondition({ isLost: true, activeMode: 'CALM' });

      const activeProfile = inclusiveProfileService.getActiveProfile();
      setProfile(activeProfile);

      setRecommendations(inclusiveRecommendationsService.getInclusiveRecommendations());

      // Simulate fetching an emergency guidance if there was an active incident
      // setEmergency(inclusiveEmergencyService.getEmergencyGuidance('EVACUATION'));

      // Simulate computing an adaptive route
      const navRoute = await adaptiveNavigationService.getAdaptiveRoute('SEAT_A12');
      setRoute(navRoute);
    };

    loadAdaptiveExperience();
  }, []);

  if (!profile)
    return <div style={{ padding: '40px', color: '#000' }}>Loading Adaptive Experience...</div>;

  const isHighContrast = profile.activeMode === 'HIGH_CONTRAST';

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        color: isHighContrast ? '#fff' : '#0f172a',
        background: isHighContrast ? '#000' : '#f8fafc',
      }}
    >
      <div
        style={{
          flex: 1,
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          overflowY: 'auto',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: isHighContrast ? '48px' : '36px',
              fontWeight: isHighContrast ? 700 : 300,
              margin: '0 0 8px 0',
              color: isHighContrast ? '#ffff00' : '#0f172a',
            }}
          >
            Inclusive Experience
          </h1>
          <p style={{ color: isHighContrast ? '#fff' : '#64748b', margin: 0, fontSize: '18px' }}>
            Adapting to your specific needs in real-time.
          </p>
        </div>

        {/* Demo toggles for reviewers to test adaptability */}
        <div
          style={{
            padding: '16px',
            background: isHighContrast ? '#111' : '#fff',
            border: isHighContrast ? '2px solid #fff' : '1px solid #e2e8f0',
            borderRadius: '12px',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <strong style={{ width: '100%' }}>Simulate Profiles:</strong>
          {['Wheelchair', 'Blind', 'HearingImpaired', 'Family', 'Lost'].map((cond) => (
            <button
              key={cond}
              onClick={() => {
                inclusiveProfileService.simulateExtendedCondition({
                  [`is${cond}`]: true,
                  activeMode:
                    cond === 'Blind'
                      ? 'VOICE_FRIENDLY'
                      : cond === 'Lost'
                        ? 'CALM'
                        : cond === 'HearingImpaired'
                          ? 'HIGH_CONTRAST'
                          : 'TEXT',
                });
                window.location.reload();
              }}
              style={{
                padding: '8px 16px',
                background: '#38bdf8',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              {cond}
            </button>
          ))}
          <button
            onClick={() => {
              setEmergency(inclusiveEmergencyService.getEmergencyGuidance('EVACUATION'));
            }}
            style={{
              padding: '8px 16px',
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Trigger Evacuation
          </button>
        </div>

        <EmergencyAlertPanel guidance={emergency} />

        <LostVisitorTracker profile={profile} />

        {route && (
          <div
            style={{
              background: isHighContrast ? '#111' : '#fff',
              border: isHighContrast ? '2px solid #fff' : '1px solid #e2e8f0',
              padding: '24px',
              borderRadius: '16px',
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
              Adaptive Routing: {route.destination}
            </h3>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {route.accessibilityFeatures?.map((feat: string) => (
                <span
                  key={feat}
                  style={{
                    background: '#dcfce7',
                    color: '#166534',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  ✓ {feat.replace('_', ' ')}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {route.warnings?.map((warn: string, i: number) => (
                <div
                  key={i}
                  style={{
                    color: '#b45309',
                    background: '#fef3c7',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                >
                  ℹ️ {warn}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ width: '450px', height: '100%' }}>
        <InclusiveCopilotUI mode={profile.activeMode} recommendations={recommendations} />
      </div>
    </div>
  );
}
