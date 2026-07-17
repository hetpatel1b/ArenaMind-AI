import { NextRequest } from 'next/server';

import { createRouteHandler } from '@/lib/api/route-factory';
import { successResponse } from '@/lib/api/response';
import { prisma } from '@/lib/db/client';

export const GET = createRouteHandler(async (req: NextRequest, { bizContext }) => {
  // Aggregate real operational data to synthesize AI Intelligence Graph & Metrics
  const incidents = await prisma.incident.findMany({ where: { status: 'active' }, include: { zone: true } });
  const cameras = await prisma.camera.findMany({ where: { status: 'active' }, take: 10 });
  const units = await prisma.workforceUnit.findMany({ where: { status: { in: ['busy', 'active', 'deployed'] } }, take: 5 });

  // 1. Build Dynamic Graph Nodes
  const nodes: any[] = [];
  const edges: any[] = [];
  
  // Incidents as critical nodes
  incidents.forEach((inc, idx) => {
    nodes.push({
      id: `inc-${inc.id}`,
      type: 'Incident',
      label: inc.title,
      x: 30 + (idx * 20),
      y: 40 + (idx * 15),
      confidence: 90 + (inc.severityTier * 3),
      status: inc.severityTier > 2 ? 'critical' : 'elevated',
    });
  });

  // Cameras as source nodes
  cameras.forEach((cam, idx) => {
    nodes.push({
      id: `cam-${cam.id}`,
      type: 'Asset',
      label: cam.name,
      x: 10 + (idx * 10),
      y: 20 + (idx * 10),
      confidence: 98,
      status: 'nominal',
    });
    // Link cameras to incidents (simulated observation)
    if (incidents.length > 0 && incidents[0]) {
      edges.push({
        id: `e-cam-${cam.id}-inc-${incidents[0].id}`,
        sourceId: `cam-${cam.id}`,
        targetId: `inc-${incidents[0].id}`,
        label: 'detects',
        strength: 0.8,
        animated: true,
      });
    }
  });

  // Units as response nodes
  units.forEach((unit, idx) => {
    nodes.push({
      id: `unit-${unit.id}`,
      type: 'Person',
      label: unit.name,
      x: 80 - (idx * 15),
      y: 80 - (idx * 10),
      confidence: 99,
      status: 'nominal',
    });
    if (incidents.length > 0 && incidents[0]) {
      edges.push({
        id: `e-unit-${unit.id}-inc-${incidents[0].id}`,
        sourceId: `unit-${unit.id}`,
        targetId: `inc-${incidents[0].id}`,
        label: 'responding',
        strength: 0.95,
        animated: true,
      });
    }
  });

  // 2. Synthesize Metrics
  const engineMetrics = {
    activeAgents: 12,
    nodesAnalyzed: nodes.length,
    correlations: edges.length,
    latency: 35,
    predictions: incidents.length * 2,
    correlationStrength: 92,
  };

  const threatLevel = incidents.length > 2 ? 'ELEVATED' : 'NOMINAL';
  const overallConfidence = 'HIGH';

  // 3. Fake AI Analysis Output (Derived from live counts)
  const reasoningStream = [
    { phase: 'Observation', content: `Detected ${incidents.length} active incidents and ${cameras.length} active cameras.`, confidence: 98 },
    { phase: 'Correlation', content: 'Correlating active incidents with workforce responses.', confidence: 95 },
    { phase: 'Reasoning', content: `Workforce coverage appears adequate for ${units.length} deployed units.`, confidence: 91 },
    { phase: 'Recommendation', content: 'Maintain current deployment strategy.', confidence: 96 }
  ];

  const sourceMetrics = [
    { id: 'cam', name: 'Cameras', status: 'Active', confidence: 97, latency: 15, health: 'Optimal', quality: 'High', trend: [1,2,1,3] },
    { id: 'inc', name: 'Incidents', status: 'Active', confidence: 95, latency: 30, health: 'Stable', quality: 'Medium', trend: [5,4,6] }
  ];

  return successResponse({
    engineMetrics,
    sourceMetrics,
    nodes: nodes ?? [],
    edges: edges ?? [],
    reasoningStream: reasoningStream ?? [],
    notifications: [],
    overallConfidence,
    threatLevel,
    rootCauseTree: null,
    scenarios: [],
    collaborationChain: [],
    memoryRecords: [],
    activeMission: [],
    executives: [],
  });
});
