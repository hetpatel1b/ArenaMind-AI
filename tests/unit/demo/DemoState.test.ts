import { describe, it, expect, vi } from 'vitest';
import { DemoState, demoStateEmitter } from '@/lib/demo/DemoState';

describe('DemoState & Emitter', () => {
  it('contains the initial global venue data', () => {
    expect(DemoState.global.venue).toBe('ArenaMind National Stadium');
    expect(DemoState.global.capacity).toBe(75000);
  });

  it('allows subscribing and unsubscribing from demoStateEmitter', () => {
    const listener = vi.fn();
    const unsubscribe = demoStateEmitter.subscribe(listener);
    
    demoStateEmitter.emit();
    expect(listener).toHaveBeenCalledTimes(1);
    
    unsubscribe();
    demoStateEmitter.emit();
    expect(listener).toHaveBeenCalledTimes(1); // Should not be called again
  });

  it('mutates state and emits update', () => {
    const listener = vi.fn();
    const unsubscribe = demoStateEmitter.subscribe(listener);
    
    const originalAttendance = DemoState.global.attendance;
    
    demoStateEmitter.mutate((state) => {
      state.global.attendance = 99999;
    });
    
    expect(listener).toHaveBeenCalledTimes(1);
    expect(DemoState.global.attendance).toBe(99999);
    
    // cleanup
    demoStateEmitter.mutate((state) => {
      state.global.attendance = originalAttendance;
    });
    unsubscribe();
  });
});
