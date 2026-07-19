'use client';

import React from 'react';
import TournamentHealthWidget from './TournamentHealthWidget';
import CrossDomainInsightsWidget from './CrossDomainInsightsWidget';
import JudgeDemonstrationPanel from './JudgeDemonstrationPanel';
import { tournamentHealthService } from '../../../lib/tournament/health/tournament-health.service';
import { crossDomainIntelligenceService } from '../../../lib/tournament/intelligence/cross-domain.service';
import { briefingService } from '../../../lib/tournament/briefings/briefing.service';
import { tournamentCopilotService } from '../../../lib/tournament/copilot/tournament-copilot.service';

export default function TournamentCommandCenter() {
  const [mounted, setMounted] = React.useState(false);

  const [healthIndex, setHealthIndex] = React.useState(tournamentHealthService.getHealthIndex());
  const [insights, setInsights] = React.useState(crossDomainIntelligenceService.getCorrelations());
  const [briefings, setBriefings] = React.useState(briefingService.getBriefings());

  const [query, setQuery] = React.useState('');
  const [response, setResponse] = React.useState('');

  React.useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  const refreshData = () => {
    setHealthIndex(tournamentHealthService.getHealthIndex());
    setInsights(crossDomainIntelligenceService.getCorrelations());
    setBriefings(briefingService.getBriefings());
  };

  if (!mounted) {
    return (
      <div style={{ display: 'flex', gap: '24px', height: '100%', padding: '24px' }}>
        Loading Command Center...
      </div>
    );
  }

  const handleAsk = () => {
    if (!query.trim()) return;
    setResponse(tournamentCopilotService.query(query));
  };

  return (
    <div style={{ display: 'flex', gap: '24px', height: '100%', padding: '24px' }}>
      {/* Left Column: Health and Insights */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <TournamentHealthWidget health={healthIndex} />
        <CrossDomainInsightsWidget insights={insights} briefings={briefings} />
      </div>

      {/* Right Column: Demo Panel & Copilot */}
      <div style={{ width: '450px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <JudgeDemonstrationPanel onScenarioTriggered={refreshData} />

        {/* Tournament Copilot Widget */}
        <div
          style={{
            background: '#0f172a',
            color: '#fff',
            borderRadius: '16px',
            padding: '24px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', color: '#38bdf8' }}>
            Tournament Copilot
          </h3>

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              marginBottom: '16px',
              background: 'rgba(255,255,255,0.05)',
              padding: '16px',
              borderRadius: '8px',
            }}
          >
            {response ? (
              <p style={{ margin: 0, lineHeight: 1.5, fontSize: '15px' }}>{response}</p>
            ) : (
              <p style={{ margin: 0, color: '#94a3b8' }}>
                Ask a question about the tournament (e.g. &quot;What stadium is under highest
                pressure?&quot;, &quot;Predict tournament-wide transportation issues&quot;)
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="Ask Copilot..."
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #334155',
                background: '#1e293b',
                color: '#fff',
              }}
            />
            <button
              onClick={handleAsk}
              style={{
                padding: '0 20px',
                background: '#38bdf8',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
