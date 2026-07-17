import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Ensures the value fluctuates smoothly within bounds, keeping the
 * dashboard feeling "alive". Pauses when tab is inactive.
 */
export function useLiveMetric(
  initialValue: number,
  minBound: number,
  maxBound: number,
  intervalMs: number = 8000,
  stepMax: number = 1
) {
  const [value, setValue] = useState(initialValue);
  const isTabActive = useRef(true);

  const [prevInitial, setPrevInitial] = useState(initialValue);

  if (initialValue !== prevInitial) {
    setPrevInitial(initialValue);
    setValue(initialValue);
  }

  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabActive.current = document.visibilityState === 'visible';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    // Deterministic jitter based on interval
    const jitter = (intervalMs * 0.1) % 1000;

    // Track elapsed time for deterministic oscillation
    let elapsed = 0;

    const intervalId = setInterval(() => {
      if (!isTabActive.current) return;

      setValue(() => {
        elapsed += 1;
        // Deterministic sine wave oscillation around the initial value
        // The value will gently sway up and down by at most stepMax
        const step = Math.sin(elapsed) * stepMax;
        let nextValue = initialValue + step;

        if (nextValue < minBound) nextValue = minBound;
        if (nextValue > maxBound) nextValue = maxBound;

        // Optionally round to 2 decimal places if it's a small number, or floor if it's large
        if (maxBound > 100) return Math.floor(nextValue);
        return Number(nextValue.toFixed(1));
      });
    }, intervalMs + jitter);

    return () => clearInterval(intervalId);
  }, [minBound, maxBound, intervalMs, stepMax, initialValue]);

  return value;
}

/**
 * Rotates between an array of strings at a defined interval.
 */
export function useTelemetry(values: string[], intervalMs: number = 10000) {
  const [index, setIndex] = useState(0);
  const isTabActive = useRef(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabActive.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isTabActive.current) return;
      setIndex((prev) => (prev + 1) % values.length);
    }, intervalMs);
    return () => clearInterval(intervalId);
  }, [values.length, intervalMs]);

  return values[index];
}

/**
 * Periodically appends realistic operational events to the activity log.
 */
export function useActivityFeed<T>(
  initialEvents: T[],
  generateEvent: () => T,
  intervalMs: number = 15000
) {
  const [events, setEvents] = useState<T[]>(initialEvents);
  const isTabActive = useRef(true);
  const [prevInitialEvents, setPrevInitialEvents] = useState(initialEvents);

  if (initialEvents !== prevInitialEvents) {
    setPrevInitialEvents(initialEvents);
    setEvents(initialEvents);
  }

  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabActive.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    // Deterministic jitter based on interval
    const jitter = (intervalMs * 0.05) % 1000;

    let counter = 0;

    const intervalId = setInterval(() => {
      if (!isTabActive.current) return;
      setEvents((currentEvents) => {
        // Prevent infinite generation if static (or use generateEvent with a counter)
        counter++;
        const newEvent = generateEvent();
        // Keep max history length to 50 to prevent memory leaks
        return [newEvent, ...currentEvents].slice(0, 50);
      });
    }, intervalMs + jitter);

    return () => clearInterval(intervalId);
  }, [generateEvent, intervalMs]);

  return events;
}

/**
 * Returns framer-motion props for subtle breathing animations.
 */
export function useStatusPulse() {
  const shouldReduceMotion = useReducedMotion();
  const [duration, setDuration] = useState(3);

  useEffect(() => {
    // Fixed deterministic duration instead of Math.random
    setTimeout(() => setDuration(3.5), 0);
  }, []);

  if (shouldReduceMotion) {
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      transition: { duration: 0 },
    };
  }

  return {
    initial: { opacity: 0.8 },
    animate: { opacity: [0.8, 0.4, 0.8] },
    transition: {
      duration: duration,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  };
}
