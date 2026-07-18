import { demoStateEmitter } from './DemoState';
import { Scenario } from './ScenarioEventGenerator';

export class ScenarioScheduler {
  private interval: NodeJS.Timeout | null = null;
  private isPlaying = false;
  private timeSeconds = 0;
  private activeScenario: Scenario | null = null;
  private onTickCallback: ((time: number, scenario: Scenario | null) => void) | null = null;

  public setOnTickCallback(cb: (time: number, scenario: Scenario | null) => void) {
    this.onTickCallback = cb;
  }

  public getActiveScenario() {
    return this.activeScenario;
  }

  public getTimeSeconds() {
    return this.timeSeconds;
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  public loadScenario(scenario: Scenario) {
    this.activeScenario = scenario;
    this.timeSeconds = 0;
    this.isPlaying = false;
    this.stopInterval();
    if (this.onTickCallback) this.onTickCallback(this.timeSeconds, this.activeScenario);
  }

  public play() {
    if (!this.activeScenario) return;
    this.isPlaying = true;
    this.startInterval();
  }

  public pause() {
    this.isPlaying = false;
    this.stopInterval();
  }

  public resetScenario(initialStateSnapshot: string | null) {
    this.stopInterval();
    this.isPlaying = false;
    this.timeSeconds = 0;
    this.activeScenario = null;

    if (initialStateSnapshot) {
      demoStateEmitter.mutate((state) => {
        const parsed = JSON.parse(initialStateSnapshot!);
        Object.assign(state, parsed);
      });
    }
    if (this.onTickCallback) this.onTickCallback(0, null);
  }

  private startInterval() {
    this.stopInterval();
    this.interval = setInterval(() => this.tick(), 1000);
  }

  private stopInterval() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private tick() {
    if (!this.isPlaying || !this.activeScenario) return;

    this.timeSeconds++;

    const eventsToTrigger = this.activeScenario.events.filter(
      (e) => e.timeSeconds === this.timeSeconds
    );

    if (eventsToTrigger.length > 0) {
      demoStateEmitter.mutate((state) => {
        eventsToTrigger.forEach((e) => e.action(state));
      });
    }

    if (this.onTickCallback) {
      this.onTickCallback(this.timeSeconds, this.activeScenario);
    }

    // Auto-stop if we passed the last event
    const lastEventTime = Math.max(...this.activeScenario.events.map((e) => e.timeSeconds));
    if (this.timeSeconds > lastEventTime + 2) {
      this.pause();
    }
  }
}
