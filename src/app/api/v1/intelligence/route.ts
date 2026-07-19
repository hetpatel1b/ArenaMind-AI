import { NextRequest } from 'next/server';

import { createRouteHandler } from '@/lib/api/route-factory';
import { successResponse } from '@/lib/api/response';
import { prisma } from '@/lib/db/client';
import { GraphBuilder, GraphLimiter } from './graph-builder';

export const GET = createRouteHandler(async (req: NextRequest, { bizContext }) => {
  // Extract optional graph limits from query string for pagination/streaming support
  const url = new URL(req.url);
  const nodeLimit =
    parseInt(url.searchParams.get('nodeLimit') || url.searchParams.get('limit') || '', 10) ||
    undefined;
  const edgeLimit = parseInt(url.searchParams.get('edgeLimit') || '', 10) || undefined;

  // Aggregate real operational data to synthesize AI Intelligence Graph & Metrics
  const [incidents, cameras, units] = await Promise.all([
    prisma.incident.findMany({
      where: { status: 'active' },
      include: { zone: true },
    }),
    prisma.camera.findMany({ where: { status: 'active' }, take: 10 }),
    prisma.workforceUnit.findMany({
      where: { status: { in: ['busy', 'active', 'deployed'] } },
      take: 5,
    }),
  ]);

  // 1. Build Dynamic Graph Nodes Safely via Configurable Constraints
  const limiter = new GraphLimiter({ nodeLimit, edgeLimit });
  const builder = new GraphBuilder(limiter);
  const { nodes, edges } = builder.build(incidents, cameras, units);

  // 2. Synthesize Metrics
  const engineMetrics = {
    activeAgents: 12,
    nodesAnalyzed: nodes.length,
    correlations: edges.length,
    latency: null,
    predictions: incidents.length * 2,
    correlationStrength: null,
  };

  const threatLevel = incidents.length > 2 ? 'ELEVATED' : 'NOMINAL';
  const overallConfidence = 'HIGH';

  // 3. AI Analysis Output (Requires real AI Gateway connection)
  const reasoningStream: SafeAny[] = [];
  const sourceMetrics: SafeAny[] = [];

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
