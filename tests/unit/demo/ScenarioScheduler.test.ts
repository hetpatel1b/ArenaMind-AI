import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ScenarioScheduler } from '@/lib/demo/ScenarioScheduler';
import { demoStateEmitter } from '@/lib/demo/DemoState';
import { Scenario } from '@/lib/demo/ScenarioEventGenerator';

describe('ScenarioScheduler', () => {
  let scheduler: ScenarioScheduler;
  
  beforeEach(() => {
    vi.useFakeTimers();
    scheduler = new ScenarioScheduler();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const dummyScenario: Scenario = {
    id: 'test',
    name: 'Test',
    description: 'Test desc',
    events: [
      {
        timeSeconds: 2,
        description: 'Event 1',
        action: vi.fn(),
      }
    ]
  };

  it('loads a scenario and sets initial state', () => {
    const cb = vi.fn();
    scheduler.setOnTickCallback(cb);
    
    scheduler.loadScenario(dummyScenario);
    
    expect(scheduler.getActiveScenario()).toBe(dummyScenario);
    expect(scheduler.getTimeSeconds()).toBe(0);
    expect(scheduler.getIsPlaying()).toBe(false);
    expect(cb).toHaveBeenCalledWith(0, dummyScenario);
  });

  it('plays and ticks', () => {
    scheduler.loadScenario(dummyScenario);
    scheduler.play();
    expect(scheduler.getIsPlaying()).toBe(true);
    
    vi.advanceTimersByTime(1000);
    expect(scheduler.getTimeSeconds()).toBe(1);
    
    vi.advanceTimersByTime(1000);
    expect(scheduler.getTimeSeconds()).toBe(2);
    // Should trigger event at second 2
    expect(dummyScenario.events[0].action).toHaveBeenCalled();
  });

  it('pauses the scheduler', () => {
    scheduler.loadScenario(dummyScenario);
    scheduler.play();
    
    vi.advanceTimersByTime(1000);
    expect(scheduler.getTimeSeconds()).toBe(1);
    
    scheduler.pause();
    vi.advanceTimersByTime(2000);
    expect(scheduler.getTimeSeconds()).toBe(1); // Should not advance
    expect(scheduler.getIsPlaying()).toBe(false);
  });

  it('resets the scenario', () => {
    vi.spyOn(demoStateEmitter, 'mutate').mockImplementation((cb) => {
      cb({} as any);
    });
    
    scheduler.loadScenario(dummyScenario);
    scheduler.play();
    vi.advanceTimersByTime(1000);
    
    const snapshot = JSON.stringify({ global: { attendance: 100 } });
    scheduler.resetScenario(snapshot);
    
    expect(scheduler.getTimeSeconds()).toBe(0);
    expect(scheduler.getActiveScenario()).toBeNull();
    expect(scheduler.getIsPlaying()).toBe(false);
    expect(demoStateEmitter.mutate).toHaveBeenCalled();
  });
  
  it('auto-stops after passing the last event', () => {
    scheduler.loadScenario(dummyScenario);
    scheduler.play();
    
    vi.advanceTimersByTime(5000); // Past event time (2) + 2 seconds
    
    expect(scheduler.getIsPlaying()).toBe(false);
  });
});
