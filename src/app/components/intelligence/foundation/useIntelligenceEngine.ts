// Force TS server refresh
import { useEffect, useRef } from 'react';
import {
  IntelligenceAction,
  SourceType,
  EntityType,
  ThreatLevel,
  ConfidenceLevel,
  ReasoningStep,
  GraphNode,
  GraphEdge,
  Notification,
  SourceMetric,
  EngineMetrics,
  ScenarioOption,
  RootCauseNode,
  AgentContribution,
  MemoryRecord,
  MissionStep,
  ExecutivePresence,
} from './IntelligenceTypes';

// Initial Mock Data
const INITIAL_NODES: GraphNode[] = [
  {
    id: 'crowd-1',
    type: EntityType.PERSON,
    label: 'Crowd Anomaly (Sector 4)',
    x: 30,
    y: 30,
    confidence: 92,
    status: 'elevated',
  },
  {
    id: 'cam-42',
    type: EntityType.ASSET,
    label: 'Camera 42',
    x: 20,
    y: 50,
    confidence: 99,
    status: 'nominal',
  },
  {
    id: 'mob-2',
    type: EntityType.VEHICLE,
    label: 'Mobility Congestion',
    x: 70,
    y: 40,
    confidence: 85,
    status: 'elevated',
  },
  {
    id: 'inc-1',
    type: EntityType.INCIDENT,
    label: 'Queue Spillback',
    x: 50,
    y: 70,
    confidence: 95,
    status: 'critical',
  },
  {
    id: 'unit-A',
    type: EntityType.PERSON,
    label: 'Response Unit A',
    x: 80,
    y: 70,
    confidence: 100,
    status: 'nominal',
  },
];

const INITIAL_EDGES: GraphEdge[] = [
  {
    id: 'e1',
    sourceId: 'cam-42',
    targetId: 'crowd-1',
    label: 'detects',
    strength: 0.9,
    animated: true,
  },
  {
    id: 'e2',
    sourceId: 'crowd-1',
    targetId: 'mob-2',
    label: 'causes',
    strength: 0.8,
    animated: true,
  },
  {
    id: 'e3',
    sourceId: 'mob-2',
    targetId: 'inc-1',
    label: 'escalates to',
    strength: 0.95,
    animated: true,
  },
  {
    id: 'e4',
    sourceId: 'unit-A',
    targetId: 'inc-1',
    label: 'dispatched to',
    strength: 1.0,
    animated: true,
  },
];

const INITIAL_SOURCES: SourceMetric[] = [
  {
    id: SourceType.CROWD,
    name: 'Crowd Intelligence',
    status: 'Active',
    confidence: 98,
    latency: 12,
    health: 'Optimal',
    quality: 'High',
    trend: [10, 12, 15, 14, 18, 20],
  },
  {
    id: SourceType.INCIDENT,
    name: 'Incident Command',
    status: 'Active',
    confidence: 100,
    latency: 8,
    health: 'Optimal',
    quality: 'High',
    trend: [5, 6, 5, 8, 7, 9],
  },
  {
    id: SourceType.MOBILITY,
    name: 'Mobility',
    status: 'Active',
    confidence: 94,
    latency: 45,
    health: 'Stable',
    quality: 'Medium',
    trend: [20, 22, 25, 24, 28, 30],
  },
  {
    id: SourceType.CAMERA,
    name: 'Camera Network',
    status: 'Active',
    confidence: 99,
    latency: 22,
    health: 'Optimal',
    quality: 'High',
    trend: [2, 3, 2, 4, 3, 5],
  },
  {
    id: SourceType.SECURITY,
    name: 'Security',
    status: 'Active',
    confidence: 97,
    latency: 15,
    health: 'Optimal',
    quality: 'High',
    trend: [1, 2, 1, 3, 2, 4],
  },
  {
    id: SourceType.WORKFORCE,
    name: 'Workforce',
    status: 'Active',
    confidence: 95,
    latency: 30,
    health: 'Stable',
    quality: 'Medium',
    trend: [5, 4, 6, 5, 7, 6],
  },
  {
    id: SourceType.WEATHER,
    name: 'Weather',
    status: 'Active',
    confidence: 99,
    latency: 120,
    health: 'Optimal',
    quality: 'High',
    trend: [10, 9, 11, 10, 12, 11],
  },
  {
    id: SourceType.INFRASTRUCTURE,
    name: 'Infrastructure',
    status: 'Active',
    confidence: 100,
    latency: 5,
    health: 'Optimal',
    quality: 'High',
    trend: [1, 1, 2, 1, 2, 1],
  },
  {
    id: SourceType.EXTERNAL,
    name: 'External Intelligence',
    status: 'Syncing',
    confidence: 85,
    latency: 250,
    health: 'Warning',
    quality: 'Low',
    trend: [40, 42, 45, 44, 48, 50],
  },
];

const CHAIN_OF_THOUGHT = [
  { phase: 'Observation', content: 'Large crowd surge detected at Sector 4.', confidence: 98 },
  {
    phase: 'Correlation',
    content:
      'North Gate camera confirms 35% density increase. Mobility congestion rising at adjacent transit hub.',
    confidence: 95,
  },
  {
    phase: 'Reasoning',
    content: 'Historical similarity 91% to Match 42 egress anomaly.',
    confidence: 91,
  },
  {
    phase: 'Prediction',
    content:
      'Expected recovery time without intervention: 12 minutes. High risk of queue spillback.',
    confidence: 88,
  },
  {
    phase: 'Recommendation',
    content: 'Recommend immediate Gate 4 Diversion and dispatch Unit A.',
    confidence: 96,
  },
  { phase: 'Impact', content: 'Projected recovery time drops to 4 minutes.', confidence: 94 },
];

const INITIAL_SCENARIOS: ScenarioOption[] = [
  {
    id: 'opt-a',
    title: 'Deploy Crowd Control',
    description: 'Immediate diversion of Sector 4 crowd to Gate B.',
    riskScore: 24,
    recoveryTime: 4,
    incidentProbability: 12,
    confidence: 96,
    impactMetrics: { crowdDensity: 45, trafficDelay: 2, resourceUsage: 80 },
  },
  {
    id: 'opt-b',
    title: 'Open Overflow Gate',
    description: 'Requires additional security screening setup.',
    riskScore: 45,
    recoveryTime: 8,
    incidentProbability: 25,
    confidence: 85,
    impactMetrics: { crowdDensity: 60, trafficDelay: 5, resourceUsage: 40 },
  },
  {
    id: 'opt-c',
    title: 'Increase Shuttle Capacity',
    description: 'Redirect 5 shuttles from North Hub.',
    riskScore: 30,
    recoveryTime: 12,
    incidentProbability: 15,
    confidence: 90,
    impactMetrics: { crowdDensity: 55, trafficDelay: 15, resourceUsage: 60 },
  },
];

const INITIAL_ROOT_CAUSE: RootCauseNode = {
  id: 'rc-1',
  label: 'Incident Risk',
  description: 'Queue Spillback Probability 88%',
  confidence: 95,
  children: [
    {
      id: 'rc-2',
      label: 'Entry Bottleneck',
      description: 'Security Queue Processing Rate dropped 40%',
      confidence: 92,
      children: [
        {
          id: 'rc-3',
          label: 'Platform Overflow',
          description: 'Metro Delay caused rapid accumulation',
          confidence: 98,
          children: [
            {
              id: 'rc-4',
              label: 'Large Crowd',
              description: 'Sector 4 Egress Anomaly',
              confidence: 99,
            },
          ],
        },
      ],
    },
  ],
};

const INITIAL_COLLABORATION: AgentContribution[] = [
  {
    agentId: 'ag-1',
    name: 'Crowd AI',
    role: 'Density Analyst',
    reasoning: 'Detected 35% density spike exceeding threshold.',
    agreement: 100,
    confidence: 99,
    color: '#38BDF8',
  },
  {
    agentId: 'ag-2',
    name: 'Mobility AI',
    role: 'Transit Correlator',
    reasoning: 'Correlated density with North Gate transit delays.',
    agreement: 95,
    confidence: 92,
    color: '#4ADE80',
  },
  {
    agentId: 'ag-3',
    name: 'Security AI',
    role: 'Risk Assessor',
    reasoning: 'Identified bottleneck at screening point Alpha.',
    agreement: 98,
    confidence: 94,
    color: '#FBBF24',
  },
  {
    agentId: 'ag-4',
    name: 'Executive AI',
    role: 'Decision Synthesizer',
    reasoning: 'Synthesized Option A as optimal path.',
    agreement: 100,
    confidence: 96,
    color: '#A855F7',
  },
];

const INITIAL_MEMORY: MemoryRecord[] = [
  {
    id: 'mem-1',
    eventName: 'Concert 2025 Egress',
    similarity: 91,
    recoveryTime: 14,
    successRate: 95,
    notes: 'Gate diversion was highly effective.',
  },
  {
    id: 'mem-2',
    eventName: 'Semi-Final Match Anomaly',
    similarity: 85,
    recoveryTime: 22,
    successRate: 78,
    notes: 'Delayed response led to minor spillback.',
  },
  {
    id: 'mem-3',
    eventName: 'Weather Evacuation',
    similarity: 62,
    recoveryTime: 45,
    successRate: 88,
    notes: 'Different root cause, similar bottleneck.',
  },
];

const INITIAL_MISSION: MissionStep[] = [
  {
    id: 'ms-1',
    action: 'Deploy Units',
    commander: 'Sec Dir',
    eta: 'T+1m',
    status: 'completed',
    risk: 'low',
  },
  {
    id: 'ms-2',
    action: 'Open Gate 4',
    commander: 'Ops Mgr',
    eta: 'T+3m',
    status: 'active',
    risk: 'medium',
  },
  {
    id: 'ms-3',
    action: 'Redirect Vehicles',
    commander: 'Traffic Cmdr',
    eta: 'T+5m',
    status: 'pending',
    risk: 'high',
  },
  {
    id: 'ms-4',
    action: 'Monitor Recovery',
    commander: 'AI Chief',
    eta: 'T+10m',
    status: 'pending',
    risk: 'low',
  },
];

const INITIAL_EXECUTIVES: ExecutivePresence[] = [
  { id: 'ex-1', name: 'Traffic Commander', role: 'Mobility', initials: 'TC', status: 'viewing' },
  { id: 'ex-2', name: 'Security Director', role: 'Security', initials: 'SD', status: 'approving' },
  {
    id: 'ex-3',
    name: 'Operations Manager',
    role: 'Operations',
    initials: 'OM',
    status: 'commenting',
  },
  { id: 'ex-4', name: 'AI Chief', role: 'Intelligence', initials: 'AC', status: 'viewing' },
];

export function useIntelligenceEngine(dispatch: React.Dispatch<IntelligenceAction>) {
  const stepRef = useRef(0);
  const reasoningStreamRef = useRef<ReasoningStep[]>([]);
  const notificationsRef = useRef<Notification[]>([]);
  const metricsRef = useRef<EngineMetrics>({
    coverage: 87,
    predictions: 124,
    correlations: 342,
    agents: 12,
    latency: 42,
    sensorHealth: 99,
    cameraHealth: 98,
    correlationStrength: 92,
    modelsRunning: 8,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Advance Chain of Thought
      const currentStep = stepRef.current;
      if (currentStep < CHAIN_OF_THOUGHT.length) {
        const stepData = CHAIN_OF_THOUGHT[currentStep]!;
        reasoningStreamRef.current = [
          ...reasoningStreamRef.current,
          {
            id: `rs-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            phase: stepData.phase as any,
            content: stepData.content,
            confidence: stepData.confidence,
          },
        ];

        // Trigger notification for high confidence or specific phases
        if (stepData.phase === 'Prediction' || stepData.phase === 'Recommendation') {
          notificationsRef.current = [
            {
              id: `notif-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString(),
              title: `AI ${stepData.phase}`,
              message: stepData.content,
              type: (stepData.phase === 'Recommendation' ? 'success' : 'warning') as
                'success' | 'warning',
            },
            ...notificationsRef.current,
          ].slice(0, 5); // Keep last 5
        }

        stepRef.current++;
      } else if (currentStep > CHAIN_OF_THOUGHT.length + 5) {
        // Reset simulation loop after a while
        stepRef.current = 0;
        reasoningStreamRef.current = [];
      } else {
        stepRef.current++;
      }

      // 2. Jitter Metrics
      metricsRef.current = {
        ...metricsRef.current,
        latency: Math.max(20, Math.min(100, metricsRef.current.latency + (Math.random() * 10 - 5))),
        predictions: metricsRef.current.predictions + (Math.random() > 0.7 ? 1 : 0),
        correlations: metricsRef.current.correlations + (Math.random() > 0.8 ? 2 : 0),
        correlationStrength: Math.max(
          80,
          Math.min(99, metricsRef.current.correlationStrength + (Math.random() * 2 - 1))
        ),
      };

      // 3. Update Source Sparklines
      const updatedSources = INITIAL_SOURCES.map((source) => {
        const newTrend = [
          ...source.trend.slice(1),
          Math.random() * 20 + (source.health === 'Optimal' ? 10 : 30),
        ];
        return { ...source, trend: newTrend };
      });

      // 4. Update Graph Nodes (slight movement / pulsing)
      const updatedNodes = INITIAL_NODES.map((node) => ({
        ...node,
        confidence: Math.max(80, Math.min(100, node.confidence + (Math.random() * 4 - 2))),
      }));

      // Determine Threat and Confidence
      const latestConfidence =
        reasoningStreamRef.current.length > 0
          ? reasoningStreamRef.current[reasoningStreamRef.current.length - 1]!.confidence
          : 95;
      const overallConfidence =
        latestConfidence > 95
          ? ConfidenceLevel.ABSOLUTE
          : latestConfidence > 90
            ? ConfidenceLevel.HIGH
            : ConfidenceLevel.MEDIUM;
      const threatLevel =
        stepRef.current > 3 && stepRef.current < 8 ? ThreatLevel.ELEVATED : ThreatLevel.NOMINAL;

      // Dispatch unified state
      dispatch({
        type: 'ENGINE_TICK',
        payload: {
          engineMetrics: metricsRef.current,
          sourceMetrics: updatedSources,
          nodes: updatedNodes,
          edges: INITIAL_EDGES,
          reasoningStream: reasoningStreamRef.current,
          notifications: notificationsRef.current,
          overallConfidence,
          threatLevel,
          rootCauseTree: stepRef.current > 2 ? INITIAL_ROOT_CAUSE : null,
          scenarios: stepRef.current > 3 ? INITIAL_SCENARIOS : [],
          collaborationChain: stepRef.current > 1 ? INITIAL_COLLABORATION : [],
          memoryRecords: INITIAL_MEMORY,
          activeMission: stepRef.current > 4 ? INITIAL_MISSION : [],
          executives: INITIAL_EXECUTIVES,
        },
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [dispatch]);
}
