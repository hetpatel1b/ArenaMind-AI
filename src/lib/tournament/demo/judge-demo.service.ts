import { multiVenueService } from '../orchestration/multi-venue.service';
import { JudgeDemoScenario, JudgeDemoState } from '../types';

export class JudgeDemoService {
  private static instance: JudgeDemoService;
  private state: JudgeDemoState = { activeScenario: null, logs: [] };

  private constructor() {}

  public static getInstance(): JudgeDemoService {
    if (!JudgeDemoService.instance) {
      JudgeDemoService.instance = new JudgeDemoService();
    }
    return JudgeDemoService.instance;
  }

  public triggerScenario(scenario: JudgeDemoScenario) {
    this.state.activeScenario = scenario;
    this.state.logs = [];

    this.log(`[SYS] Triggering Scenario: ${scenario}`);

    // Reset any previous disruptions
    multiVenueService.clearDisruptions();

    switch (scenario) {
      case 'CROWD_SURGE':
        this.log('Detection: Unplanned crowd surge identified at Venue B (Al Bayt).');
        multiVenueService.injectDisruption('V-B', {
          pressureScore: 98,
          waitTimesMinutes: 45,
          incidentCount: 5,
        });
        this.log('Reasoning: High localized pressure will cause cascading transport failures.');
        this.log(
          'Recommendation: Redirecting 50% of available volunteers from Venue A to Venue B.'
        );
        this.log('Outcome: Venue B queue times stabilized. Tournament-wide panic averted.');
        break;

      case 'MEDICAL_EMERGENCY':
        this.log('Detection: Cardiac incident flagged in Sector 4, Venue C.');
        multiVenueService.injectDisruption('V-C', { activeMedical: 5, pressureScore: 100 });
        this.log('Reasoning: Current routing overlaps with main fan egress, blocking EMTs.');
        this.log(
          'Recommendation: Activate Inclusive Emergency protocol. Clear Gate 2 for priority medical egress.'
        );
        this.log('Outcome: EMTs reached patient in 180s (32% faster than baseline).');
        break;

      case 'HEAVY_RAIN':
        this.log('Detection: Severe weather alert crossing all 3 venues.');
        multiVenueService.injectDisruption('V-A', { waitTimesMinutes: 30 });
        multiVenueService.injectDisruption('V-B', { waitTimesMinutes: 40 });
        multiVenueService.injectDisruption('V-C', { waitTimesMinutes: 35 });
        this.log('Reasoning: External walkways unsafe. Walking Fan Contexts will seek shelter.');
        this.log(
          'Recommendation: Hold all fans in concourse. Activate shelter-in-place messaging.'
        );
        this.log('Outcome: Prevented dangerous trampling at transit hubs.');
        break;

      case 'TRANSPORT_DISRUPTION':
        this.log('Detection: Metro Line Red disabled at Venue A.');
        multiVenueService.injectDisruption('V-A', { pressureScore: 99, waitTimesMinutes: 120 });
        this.log('Reasoning: 40,000 fans stranded. Shuttle capacity exceeded.');
        this.log('Recommendation: Dispatch reserve EV shuttles from Venue B and C to Venue A.');
        this.log('Outcome: 25 EV shuttles en route. Stranded capacity reducing by 15% per hour.');
        break;

      case 'LOST_CHILD':
        this.log('Detection: Lost Child protocol activated at Venue A.');
        multiVenueService.injectDisruption('V-A', { incidentCount: 4 });
        this.log('Reasoning: Standard evacuation or routing would endanger the child.');
        this.log('Recommendation: Freeze child location. Dispatch nearest Inclusive Volunteer.');
        this.log('Outcome: Successful reunification at Information Desk 4 in 4 minutes.');
        break;

      case 'ENERGY_SPIKE':
        this.log('Detection: HVAC power draw at Venue C exceeded 9MW peak limit.');
        multiVenueService.injectDisruption('V-C', { sustainabilityScore: 40 });
        this.log('Reasoning: Crowd density dropping in South sector while HVAC is still 100%.');
        this.log('Recommendation: Auto-throttle South sector HVAC to 30%.');
        this.log('Outcome: Peak power reduced to 7.8MW. Sustainability score improved to 90.');
        break;

      case 'WASTE_OVERFLOW':
        this.log('Detection: 15 bins in Venue B East Plaza at 95% capacity.');
        multiVenueService.injectDisruption('V-B', { sustainabilityScore: 65, pressureScore: 70 });
        this.log('Reasoning: Standard janitorial route will not reach them for 45 mins.');
        this.log('Recommendation: Generate AI predictive route prioritizing East Plaza.');
        this.log('Outcome: Overflow prevented. Fan experience maintained.');
        break;
    }
  }

  public reset() {
    this.state.activeScenario = null;
    this.state.logs = [];
    multiVenueService.clearDisruptions();
  }

  public getState(): JudgeDemoState {
    return this.state;
  }

  private log(message: string) {
    this.state.logs.push(message);
  }
}

export const judgeDemoService = JudgeDemoService.getInstance();
