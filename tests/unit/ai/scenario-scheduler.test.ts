import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import { ScenarioScheduler } from '../../../src/lib/demo/ScenarioScheduler';
import { demoStateEmitter, DemoState } from '../../../src/lib/demo/DemoState';

describe('ScenarioScheduler', () => {
  let scheduler: ScenarioScheduler;

  beforeEach(() => {
    vi.useFakeTimers();
    scheduler = new ScenarioScheduler();

    // We mock demoStateEmitter to avoid actually mutating the global singleton in tests
    vi.spyOn(demoStateEmitter, 'mutate').mockImplementation((updater) => {
      // Just call it on a fake state object to ensure it works
      const fakeState = JSON.parse(JSON.stringify(DemoState));
      updater(fakeState);
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('initializes with default values', () => {
    expect(scheduler.getActiveScenario()).toBeNull();
    expect(scheduler.getTimeSeconds()).toBe(0);
    expect(scheduler.getIsPlaying()).toBe(false);
  });

  it('loads a scenario correctly and triggers callback', () => {
    const callback = vi.fn();
    scheduler.setOnTickCallback(callback);

    const scenario = {
      id: 'test',
      name: 'Test Scenario',
      description: 'Test',
      events: [],
    };

    scheduler.loadScenario(scenario);

    expect(scheduler.getActiveScenario()).toEqual(scenario);
    expect(scheduler.getTimeSeconds()).toBe(0);
    expect(scheduler.getIsPlaying()).toBe(false);
    expect(callback).toHaveBeenCalledWith(0, scenario);
  });

  it('play() starts the timer and updates timeSeconds', () => {
    const scenario = {
      id: 'test',
      name: 'Test',
      description: 'Test',
      events: [{ timeSeconds: 10, description: 'Far future', action: vi.fn() }],
    };
    scheduler.loadScenario(scenario);
    scheduler.play();

    expect(scheduler.getIsPlaying()).toBe(true);

    vi.advanceTimersByTime(2500); // 2.5 seconds

    // tick() is called every 1000ms. So it should have advanced 2 times.
    expect(scheduler.getTimeSeconds()).toBe(2);
  });

  it('pause() stops the timer', () => {
    const scenario = {
      id: 'test',
      name: 'Test',
      description: 'Test',
      events: [{ timeSeconds: 10, description: 'Far future', action: vi.fn() }],
    };
    scheduler.loadScenario(scenario);
    scheduler.play();

    vi.advanceTimersByTime(1000);
    expect(scheduler.getTimeSeconds()).toBe(1);

    scheduler.pause();
    vi.advanceTimersByTime(2000);

    // Still 1 because it's paused
    expect(scheduler.getTimeSeconds()).toBe(1);
    expect(scheduler.getIsPlaying()).toBe(false);
  });

  it('triggers scenario events at the correct time', () => {
    const actionSpy = vi.fn();
    const scenario = {
      id: 'test',
      name: 'Test',
      description: 'Test',
      events: [{ timeSeconds: 2, description: 'Event 1', action: actionSpy }],
    };

    scheduler.loadScenario(scenario);
    scheduler.play();

    vi.advanceTimersByTime(1000); // 1s
    expect(actionSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000); // 2s
    expect(demoStateEmitter.mutate).toHaveBeenCalled();
    expect(actionSpy).toHaveBeenCalled();
  });

  it('auto-stops after the last event', () => {
    const scenario = {
      id: 'test',
      name: 'Test',
      description: 'Test',
      events: [{ timeSeconds: 1, description: 'Event 1', action: vi.fn() }],
    };

    scheduler.loadScenario(scenario);
    scheduler.play();

    // The auto-stop is triggered if timeSeconds > lastEventTime + 2
    // lastEventTime is 1. We stop at 4.

    vi.advanceTimersByTime(4000); // 4s

    expect(scheduler.getIsPlaying()).toBe(false); // Should have auto-paused
  });

  it('resetScenario() restores state and resets scheduler', () => {
    const callback = vi.fn();
    scheduler.setOnTickCallback(callback);

    const scenario = {
      id: 'test',
      name: 'Test',
      description: 'Test',
      events: [{ timeSeconds: 10, description: 'Far future', action: vi.fn() }],
    };
    scheduler.loadScenario(scenario);
    scheduler.play();

    vi.advanceTimersByTime(2000);
    expect(scheduler.getTimeSeconds()).toBe(2);

    const snapshot = JSON.stringify({ global: { status: 'TEST_RESTORE' } });
    scheduler.resetScenario(snapshot);

    expect(scheduler.getIsPlaying()).toBe(false);
    expect(scheduler.getTimeSeconds()).toBe(0);
    expect(scheduler.getActiveScenario()).toBeNull();
    expect(demoStateEmitter.mutate).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(0, null);
  });
});
