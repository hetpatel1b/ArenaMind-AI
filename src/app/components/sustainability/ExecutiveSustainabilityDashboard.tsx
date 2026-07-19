'use client';

import React from 'react';
import CarbonKpiWidget from './widgets/CarbonKpiWidget';
import ResourceKpiWidget from './widgets/ResourceKpiWidget';
import WasteDashboardWidget from './widgets/WasteDashboardWidget';
import WaterDashboardWidget from './widgets/WaterDashboardWidget';
import SustainabilityCopilotPanel from './copilot/SustainabilityCopilotPanel';
import { carbonIntelligenceService } from '../../../lib/sustainability/intelligence/carbon.service';
import { energyIntelligenceService } from '../../../lib/sustainability/intelligence/energy.service';
import { wasteIntelligenceService } from '../../../lib/sustainability/intelligence/waste.service';
import { waterIntelligenceService } from '../../../lib/sustainability/intelligence/water.service';
import { sustainabilityRecommendationsService } from '../../../lib/sustainability/recommendations.service';
import { sustainabilityCopilotService } from '../../../lib/sustainability/copilot.service';

export default function ExecutiveSustainabilityDashboard() {
  const [data, setData] = React.useState<SafeAny>({
    carbon: null,
    energy: null,
    waste: null,
    water: null,
    recommendations: [],
    analysis: '',
  });

  React.useEffect(() => {
    async function loadData() {
      const [carbon, energy, waste, water, recommendations, analysis] = await Promise.all([
        carbonIntelligenceService.getCarbonInsights(),
        energyIntelligenceService.getEnergyInsights(),
        wasteIntelligenceService.getWasteInsights(),
        waterIntelligenceService.getWaterInsights(),
        sustainabilityRecommendationsService.getLiveRecommendations(),
        sustainabilityCopilotService.getAnalysisReport(),
      ]);

      setData({ carbon, energy, waste, water, recommendations, analysis });
    }
    loadData();
  }, []);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', color: '#fff' }}>
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 300, margin: '0 0 8px 0' }}>
            Sustainability Intelligence
          </h1>
          <p style={{ color: '#94a3b8', margin: 0 }}>
            Executive Command Center for Environmental Operations
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '24px',
          }}
        >
          <CarbonKpiWidget metrics={data.carbon} />
          <ResourceKpiWidget energy={data.energy} waste={data.waste} water={data.water} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <WasteDashboardWidget waste={data.waste} />
          <WaterDashboardWidget water={data.water} />
        </div>
      </div>

      <div style={{ width: '450px', height: '100%' }}>
        <SustainabilityCopilotPanel
          recommendations={data.recommendations}
          analysisText={data.analysis}
        />
      </div>
    </div>
  );
}
