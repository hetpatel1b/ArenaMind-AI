import { demoStateEmitter, DemoState } from './DemoState';
import { SCENARIOS } from './ScenarioEventGenerator';
import { ScenarioScheduler } from './ScenarioScheduler';

export class ScenarioEngine {
  private initialStateSnapshot: string | null = null;
  private scheduler = new ScenarioScheduler();

  constructor() {
    this.initialStateSnapshot = JSON.stringify(DemoState);
  }

  public getAvailableScenarios() {
    return SCENARIOS;
  }

  public loadScenario(id: string) {
    const scenario = SCENARIOS.find((s) => s.id === id);
    if (scenario) {
      this.scheduler.loadScenario(scenario);
    }
  }

  public get activeScenario() {
    return this.scheduler.getActiveScenario();
  }

  public get timeSeconds() {
    return this.scheduler.getTimeSeconds();
  }

  public get isPlaying() {
    return this.scheduler.getIsPlaying();
  }

  public setOnTickCallback(cb: (time: number, scenario: any | null) => void) {
    this.scheduler.setOnTickCallback(cb);
  }

  public play() {
    this.scheduler.play();
  }

  public pause() {
    this.scheduler.pause();
  }

  public resetScenario() {
    this.scheduler.resetScenario(this.initialStateSnapshot);
  }
}

export const DemoScenarioEngine = new ScenarioEngine();
