import { ScenarioTemplate } from './types';
import { normalOperations } from './scenarios/01-normal-operations';
import { highCrowd } from './scenarios/02-high-crowd';
import { medicalEmergency } from './scenarios/03-medical-emergency';
import { transportDisruption } from './scenarios/04-transport-disruption';
import { exitFlowSurge } from './scenarios/05-exit-flow-surge';

export class ScenarioRegistry {
  private static scenarios: ScenarioTemplate[] = [
    normalOperations,
    highCrowd,
    medicalEmergency,
    transportDisruption,
    exitFlowSurge,
  ];

  /**
   * Selects a random scenario template to ensure every demo is unique.
   */
  public static getRandomScenario(): ScenarioTemplate {
    const randomIndex = Math.floor(Math.random() * this.scenarios.length);
    return this.scenarios[randomIndex]!;
  }

  /**
   * Helper to retrieve a specific scenario by ID, useful for targeted testing.
   */
  public static getScenarioById(id: string): ScenarioTemplate | undefined {
    return this.scenarios.find((s) => s.meta.id === id);
  }
}
