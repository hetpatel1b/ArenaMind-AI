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
    // Add some random jitter to the interval so multiple metrics don't update on the exact same frame
    const jitter = Math.random() * (intervalMs * 0.2);

    const intervalId = setInterval(() => {
      if (!isTabActive.current) return;

      setValue((current) => {
        const step = Math.random() * stepMax * 2 - stepMax;
        let nextValue = current + step;

        if (nextValue < minBound) nextValue = minBound + Math.abs(step);
        if (nextValue > maxBound) nextValue = maxBound - Math.abs(step);

        return nextValue;
      });
    }, intervalMs + jitter);

    return () => clearInterval(intervalId);
  }, [minBound, maxBound, intervalMs, stepMax]);

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
    const jitter = Math.random() * 2000;
    const intervalId = setInterval(() => {
      if (!isTabActive.current) return;
      setIndex((prev) => (prev + 1) % values.length);
    }, intervalMs + jitter);
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
    const jitter = Math.random() * 5000;
    const intervalId = setInterval(() => {
      if (!isTabActive.current) return;
      setEvents((currentEvents) => {
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
    setTimeout(() => setDuration(3 + Math.random()), 0);
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
