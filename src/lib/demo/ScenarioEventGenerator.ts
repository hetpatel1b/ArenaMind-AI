import { DemoStateType } from './DemoState';

export interface ScenarioEvent {
  timeSeconds: number;
  description: string;
  action: (state: DemoStateType) => void;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  events: ScenarioEvent[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'surge',
    name: 'Crowd Surge',
    description: 'Gate B experiences dangerous overcrowding.',
    events: [
      {
        timeSeconds: 2,
        description: 'Gate B occupancy spikes to 95%',
        action: (s) => {
          s.crowd.gateB.occupancy = 95;
          s.crowd.gateB.status = 'critical';
          s.notifications.unshift({
            id: 'surge-1',
            message: 'Gate B occupancy exceeded 95%',
            time: '20:47',
            type: 'error',
          });
        },
      },
      {
        timeSeconds: 5,
        description: 'AI detects surge and creates incident',
        action: (s) => {
          s.incidents.unshift({
            id: 'INC-7105',
            type: 'Crowd Control',
            severity: 'critical',
            status: 'active',
            location: 'Gate B',
            description: 'Dangerous crowd density detected. Risk of crush.',
            timestamp: '20:47',
          });
          s.copilot.currentObservations =
            'Gate B occupancy has reached 95%. Incident INC-7105 created for Crowd Surge.';
          s.copilot.reasoning = 'Immediate load balancing is required to prevent crush injuries.';
          s.copilot.recommendations = [
            'Reroute incoming attendees to Gate C',
            'Deploy 2 additional security units to Gate B',
          ];
          s.copilot.executiveSummary =
            'Critical crowd surge at Gate B. Automated rerouting and workforce dispatch recommended.';
        },
      },
      {
        timeSeconds: 10,
        description: 'Workforce Dispatched & Rerouting Initiated',
        action: (s) => {
          s.workforce.activePatrols += 2;
          s.workforce.recentDispatch = '2 Security units dispatched to Gate B';
          s.notifications.unshift({
            id: 'surge-2',
            message: 'Digital signage updated to route traffic to Gate C',
            time: '20:48',
            type: 'info',
          });
        },
      },
      {
        timeSeconds: 18,
        description: 'Crowd level stabilizes',
        action: (s) => {
          s.crowd.gateB.occupancy = 82;
          s.crowd.gateB.status = 'normal';
          s.incidents[0]!.status = 'resolved';
          s.incidents[0]!.resolvedAt = '20:50';
          s.copilot.currentObservations =
            'Gate B occupancy reduced to 82%. Incident INC-7105 resolved.';
          s.copilot.executiveSummary =
            'Crowd surge successfully mitigated. Normal operations resumed.';
          s.notifications.unshift({
            id: 'surge-3',
            message: 'Incident INC-7105 resolved. Gate B normal.',
            time: '20:50',
            type: 'success',
          });
        },
      },
    ],
  },
  {
    id: 'medical',
    name: 'Medical Emergency',
    description: 'Spectator collapse in Sector A.',
    events: [
      {
        timeSeconds: 2,
        description: 'Medical emergency reported',
        action: (s) => {
          s.incidents.unshift({
            id: 'INC-7106',
            type: 'Medical',
            severity: 'critical',
            status: 'active',
            location: 'Sector A, Row 5',
            description: 'Spectator collapsed. Unresponsive.',
            timestamp: '20:51',
          });
          s.notifications.unshift({
            id: 'med-1',
            message: 'Medical Emergency reported at Sector A',
            time: '20:51',
            type: 'error',
          });
          s.copilot.currentObservations = 'Medical emergency INC-7106 detected in Sector A.';
          s.copilot.reasoning = 'Nearest medical unit is MED-4 (2 mins away). AED required.';
          s.copilot.recommendations = [
            'Dispatch MED-4 with AED',
            'Clear aisle in Sector A for stretcher access',
          ];
          s.copilot.executiveSummary =
            'Critical medical incident in Sector A. Medical response coordinated.';
        },
      },
      {
        timeSeconds: 8,
        description: 'Medical team arrives',
        action: (s) => {
          s.workforce.recentDispatch = 'MED-4 arrived at Sector A';
          s.notifications.unshift({
            id: 'med-2',
            message: 'Medical unit MED-4 on scene',
            time: '20:53',
            type: 'info',
          });
        },
      },
      {
        timeSeconds: 15,
        description: 'Incident resolved',
        action: (s) => {
          s.incidents[0]!.status = 'resolved';
          s.incidents[0]!.resolvedAt = '20:58';
          s.copilot.currentObservations = 'Patient stabilized and transported. INC-7106 resolved.';
          s.copilot.executiveSummary =
            'Medical emergency successfully handled. Patient en route to hospital.';
          s.notifications.unshift({
            id: 'med-3',
            message: 'Patient transported. Area clear.',
            time: '20:58',
            type: 'success',
          });
        },
      },
    ],
  },
  {
    id: 'threat',
    name: 'Security Threat',
    description: 'Suspicious package detected at Concourse West.',
    events: [
      {
        timeSeconds: 2,
        description: 'Package detected',
        action: (s) => {
          s.incidents.unshift({
            id: 'INC-7107',
            type: 'Security',
            severity: 'critical',
            status: 'active',
            location: 'Concourse West',
            description: 'Unattended suspicious package near food court.',
            timestamp: '21:00',
          });
          s.copilot.currentObservations = 'Suspicious package INC-7107 detected at Concourse West.';
          s.copilot.reasoning =
            'High foot traffic area. Immediate containment required per protocols.';
          s.copilot.recommendations = [
            'Establish 50m perimeter',
            'Dispatch EOD response team',
            'Reroute Concourse West foot traffic',
          ];
          s.copilot.executiveSummary =
            'Security threat identified. Perimeter established and EOD en route.';
        },
      },
      {
        timeSeconds: 7,
        description: 'Perimeter established',
        action: (s) => {
          s.workforce.activePatrols += 4;
          s.notifications.unshift({
            id: 'sec-1',
            message: '50m perimeter established at Concourse West',
            time: '21:03',
            type: 'warning',
          });
          s.copilot.currentObservations =
            'Perimeter secured. Foot traffic successfully rerouted to North Concourse.';
        },
      },
      {
        timeSeconds: 16,
        description: 'Threat cleared',
        action: (s) => {
          s.incidents[0]!.status = 'resolved';
          s.incidents[0]!.resolvedAt = '21:15';
          s.copilot.currentObservations =
            'Package inspected and cleared by EOD. INC-7107 resolved.';
          s.copilot.executiveSummary =
            'Security threat mitigated. False alarm. Normal operations resumed.';
          s.notifications.unshift({
            id: 'sec-2',
            message: 'All clear. Concourse West reopened.',
            time: '21:15',
            type: 'success',
          });
        },
      },
    ],
  },
];
