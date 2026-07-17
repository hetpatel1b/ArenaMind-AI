'use client';

import { IncidentWorkspace } from './foundation/IncidentWorkspace';
import { Incident, PriorityLevel, IncidentStage } from './foundation/IncidentTypes';

export interface IncidentMatchPayload {
  id: string;
  matchNumber: number;
  homeTeam: string;
  awayTeam: string;
  currentPhase: string;
  venue: { name: string; capacity: number; zones: any[] };
  incidents: any[];
  resources: any[];
  aiRecommendations: any[];
  phaseTransitions: any[];
}

export function IncidentCommandWorkspace({ matchData }: { matchData: IncidentMatchPayload }) {
  const mappedIncidents: Incident[] = matchData.incidents.map((dbInc, index) => {
    let priority: PriorityLevel = 'LOW';
    if (dbInc.severityTier === 1) priority = 'CRITICAL';
    else if (dbInc.severityTier === 2) priority = 'HIGH';
    else if (dbInc.severityTier === 3) priority = 'MEDIUM';

    let stage: IncidentStage = 'REPORTED';
    if (dbInc.status === 'resolved' || dbInc.status === 'closed') stage = 'RESOLVED';
    else if (dbInc.assignedTo) stage = 'ASSIGNED';

    return {
      id: dbInc.id,
      title: dbInc.title || 'Unknown Incident',
      priority,
      category: dbInc.incidentType?.name || dbInc.type || 'Unknown Category',
      location: dbInc.zone?.name || 'Unknown Zone',
      reportedTime: dbInc.createdAt || new Date().toISOString(),
      assignedTeam: dbInc.assignee?.name || null,
      currentStage: stage,
      aiConfidence: 85 + (index % 10),
      requiresHumanApproval: priority === 'CRITICAL' || priority === 'HIGH',
      progress: stage === 'RESOLVED' ? 100 : 25,
      evidence: [],
      reasoningLog: [],
    };
  });

  const fallbackIncidents: Incident[] = [
    {
      id: 'mock-1',
      title: 'Sector 4 Disturbance',
      priority: 'HIGH',
      category: 'Security',
      location: 'Gate A',
      reportedTime: new Date().toISOString(),
      assignedTeam: null,
      currentStage: 'REPORTED',
      aiConfidence: 95,
      requiresHumanApproval: true,
      progress: 0,
      evidence: [],
      reasoningLog: [],
    },
  ];

  const initialIncidents = mappedIncidents.length > 0 ? mappedIncidents : fallbackIncidents;
  const criticalCount = initialIncidents.filter(
    (i) => i.priority === 'CRITICAL' && i.currentStage !== 'RESOLVED'
  ).length;

  const metrics = {
    criticalCount,
    highCount: initialIncidents.filter(
      (i) => i.priority === 'HIGH' && i.currentStage !== 'RESOLVED'
    ).length,
    mediumCount: initialIncidents.filter(
      (i) => i.priority === 'MEDIUM' && i.currentStage !== 'RESOLVED'
    ).length,
    lowCount: initialIncidents.filter((i) => i.priority === 'LOW' && i.currentStage !== 'RESOLVED')
      .length,
    openMissions: initialIncidents.filter(
      (i) => i.currentStage === 'ASSIGNED' || i.currentStage === 'DISPATCHED'
    ).length,
    responseSlaPercent: 98.2,
    averageResponseTimeMs: 120000,
    averageVerificationTimeMs: 45000,
    resolvedToday: 12,
    aiConfidencePercent: 94,
    slaRiskPercent: 2,
    escalationStatus: (criticalCount > 0 ? 'CRITICAL' : 'NOMINAL') as
      'CRITICAL' | 'NOMINAL' | 'ELEVATED',
    humanApprovalQueueCount: initialIncidents.filter(
      (i) => i.requiresHumanApproval && i.currentStage !== 'RESOLVED'
    ).length,
    systemReadinessPercent: 99.9,
  };

  return <IncidentWorkspace initialMetrics={metrics} initialIncidents={initialIncidents} />;
}
