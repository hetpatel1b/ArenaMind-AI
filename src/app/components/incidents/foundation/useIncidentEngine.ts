import { useState, useEffect, useMemo } from 'react';
import {
  Incident,
  Resource,
  IncidentStage,
  Department,
  SystemNotification,
  ChatMessage,
} from './IncidentTypes';
import { ExecutiveBannerProps } from './ExecutiveIncidentBanner';

const STAGES: IncidentStage[] = [
  'REPORTED',
  'VERIFIED',
  'ANALYZING',
  'ASSIGNED',
  'DISPATCHED',
  'CONTAINED',
  'RESOLVED',
  'ARCHIVED',
];

const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'R-1',
    type: 'POLICE',
    status: 'AVAILABLE',
    distance: '0.4mi',
    eta: '2m',
    battery: 94,
    radioStatus: 'NOMINAL',
    crewSize: 2,
    fuel: 80,
  },
  {
    id: 'R-2',
    type: 'MEDICAL',
    status: 'AVAILABLE',
    distance: '1.2mi',
    eta: '5m',
    battery: 88,
    radioStatus: 'NOMINAL',
    crewSize: 3,
    fuel: 90,
  },
  {
    id: 'R-3',
    type: 'SECURITY',
    status: 'DISPATCHED',
    distance: '0.1mi',
    eta: '1m',
    battery: 42,
    radioStatus: 'DEGRADED',
    crewSize: 4,
    fuel: 30,
  },
  {
    id: 'R-4',
    type: 'FIRE',
    status: 'AVAILABLE',
    distance: '2.5mi',
    eta: '8m',
    battery: 100,
    radioStatus: 'NOMINAL',
    crewSize: 6,
    fuel: 100,
  },
  {
    id: 'R-5',
    type: 'TRAFFIC',
    status: 'STANDBY',
    distance: '1.8mi',
    eta: '6m',
    battery: 75,
    radioStatus: 'NOMINAL',
    crewSize: 1,
    fuel: 60,
  },
  {
    id: 'R-6',
    type: 'OPERATIONS',
    status: 'RETURNING',
    distance: '3.0mi',
    eta: '10m',
    battery: 15,
    radioStatus: 'DEGRADED',
    crewSize: 2,
    fuel: 20,
  },
];

const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'D-1',
    name: 'POLICE',
    commander: 'Cpt. Reynolds',
    status: 'READY',
    activeUnits: 12,
    currentTask: 'Perimeter Sweep',
    radioStatus: 'NOMINAL',
  },
  {
    id: 'D-2',
    name: 'MEDICAL',
    commander: 'Dr. Vance',
    status: 'DEPLOYED',
    activeUnits: 4,
    currentTask: 'Triage Setup',
    radioStatus: 'NOMINAL',
  },
  {
    id: 'D-3',
    name: 'FIRE',
    commander: "Chief O'Brien",
    status: 'READY',
    activeUnits: 8,
    currentTask: 'Standby',
    radioStatus: 'NOMINAL',
  },
  {
    id: 'D-4',
    name: 'SECURITY',
    commander: 'Dir. Vance',
    status: 'OVERCAPACITY',
    activeUnits: 24,
    currentTask: 'Crowd Control',
    radioStatus: 'DEGRADED',
  },
  {
    id: 'D-5',
    name: 'TRAFFIC',
    commander: 'Sgt. Lin',
    status: 'READY',
    activeUnits: 6,
    currentTask: 'Road Closure',
    radioStatus: 'NOMINAL',
  },
  {
    id: 'D-6',
    name: 'OPERATIONS',
    commander: 'Exec. Silva',
    status: 'READY',
    activeUnits: 2,
    currentTask: 'Command Sync',
    radioStatus: 'NOMINAL',
  },
];

const REASONING_MESSAGES = [
  { text: 'Analyzing CCTV cluster...', type: 'ANALYSIS' as const },
  { text: 'Comparing historical incidents...', type: 'CROSS_REF' as const },
  { text: 'Cross-referencing crowd density...', type: 'CROSS_REF' as const },
  { text: 'Evaluating evacuation routes...', type: 'ANALYSIS' as const },
  { text: 'Monitoring emergency channels...', type: 'MONITORING' as const },
  { text: 'Calculating responder ETA...', type: 'CALCULATION' as const },
  { text: 'Verifying witness reports...', type: 'ANALYSIS' as const },
  { text: 'Running propagation model...', type: 'CALCULATION' as const },
];

export function useIncidentEngine(initialIncidents: Incident[]) {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [resources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Engine Tick Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setIncidents((currentIncidents) =>
        currentIncidents.map((incident) => {
          // Progress simulation
          let newProgress = incident.progress;
          let newStage = incident.currentStage;

          if (newStage !== 'RESOLVED' && newStage !== 'ARCHIVED') {
            newProgress += Math.random() * 2;
            if (newProgress >= 100) {
              const currentStageIndex = STAGES.indexOf(incident.currentStage);
              if (currentStageIndex < STAGES.length - 1) {
                newStage = STAGES[currentStageIndex + 1] || newStage;
                newProgress = 0;
              }
            }
          }

          // Reasoning simulation
          const newReasoningLog = incident.reasoningLog ? [...incident.reasoningLog] : [];
          if (Math.random() > 0.7 && newStage !== 'RESOLVED' && newStage !== 'ARCHIVED') {
            const randomMsg =
              REASONING_MESSAGES[Math.floor(Math.random() * REASONING_MESSAGES.length)];
            if (randomMsg) {
              newReasoningLog.unshift({
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toISOString(),
                message: randomMsg.text,
                type: randomMsg.type,
              });
              if (newReasoningLog.length > 5) newReasoningLog.pop(); // Keep log short for UI
            }
          }

          return {
            ...incident,
            progress: Math.min(newProgress, 100),
            currentStage: newStage,
            reasoningLog: newReasoningLog,
          };
        })
      );

      // Simulate occasional comms & notifications
      if (Math.random() > 0.8) {
        setChatMessages((prev) => {
          const senders = ['POLICE-01', 'MED-04', 'SYSTEM', 'AI-COPILOT'];
          const contents = [
            'Approaching target sector.',
            'Crowd density increasing.',
            'Requesting medical backup.',
            'Traffic diverted successfully.',
          ];

          const newMsg: ChatMessage = {
            id: Math.random().toString(36).substr(2, 9),
            sender: senders[Math.floor(Math.random() * senders.length)] || 'SYSTEM',
            role: 'OPERATOR',
            content: contents[Math.floor(Math.random() * contents.length)] || 'Status update',
            timestamp: new Date().toISOString(),
          };
          if (newMsg.sender === 'SYSTEM') newMsg.role = 'SYSTEM';
          if (newMsg.sender === 'AI-COPILOT') newMsg.role = 'AI';
          return [newMsg, ...prev].slice(0, 50);
        });
      }

      if (Math.random() > 0.9) {
        setNotifications((prev) => {
          const newNotif: SystemNotification = {
            id: Math.random().toString(36).substr(2, 9),
            type: ['INFO', 'WARNING', 'CRITICAL', 'SUCCESS'][Math.floor(Math.random() * 4)] as any,
            message: 'Status update received from field unit.',
            timestamp: new Date().toISOString(),
          };
          return [newNotif, ...prev].slice(0, 5); // Keep short
        });
      }
    }, 2000); // Tick every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const metrics: ExecutiveBannerProps['metrics'] = useMemo(() => {
    return {
      criticalCount: incidents.filter(
        (i) =>
          i.priority === 'CRITICAL' &&
          i.currentStage !== 'RESOLVED' &&
          i.currentStage !== 'ARCHIVED'
      ).length,
      highCount: incidents.filter(
        (i) =>
          i.priority === 'HIGH' && i.currentStage !== 'RESOLVED' && i.currentStage !== 'ARCHIVED'
      ).length,
      mediumCount: incidents.filter(
        (i) =>
          i.priority === 'MEDIUM' && i.currentStage !== 'RESOLVED' && i.currentStage !== 'ARCHIVED'
      ).length,
      lowCount: incidents.filter(
        (i) =>
          i.priority === 'LOW' && i.currentStage !== 'RESOLVED' && i.currentStage !== 'ARCHIVED'
      ).length,
      openMissions: incidents.filter(
        (i) => i.currentStage === 'DISPATCHED' || i.currentStage === 'ASSIGNED'
      ).length,
      responseSlaPercent: 96.4 + (incidents.length % 2) * 1.5,
      averageResponseTimeMs: 240000 + incidents.length * 1000,
      averageVerificationTimeMs: 45000 + incidents.length * 500,
      resolvedToday: 14 + (incidents.length % 3),
      aiConfidencePercent: 92 + (incidents.length % 4),
      slaRiskPercent: 4.2 + (incidents.length % 2),
      escalationStatus: incidents.some((i) => i.priority === 'CRITICAL') ? 'CRITICAL' : 'NOMINAL',
      humanApprovalQueueCount: incidents.filter(
        (i) => i.requiresHumanApproval && i.currentStage !== 'RESOLVED'
      ).length,
      systemReadinessPercent: 99.8,
    };
  }, [incidents]);

  return { incidents, resources, departments, notifications, chatMessages, metrics };
}
