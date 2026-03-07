import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerResult {
  elapsed: number; // seconds
  isRunning: boolean;
  start: () => void;
  stop: () => number; // returns elapsed seconds
  reset: () => void;
}

export function useTimer(initialRunning = false): UseTimerResult {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(initialRunning);
  const startTimeRef = useRef<number | null>(initialRunning ? Date.now() : null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    setElapsed(0);
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const finalElapsed = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : elapsed;
    return finalElapsed;
  }, [elapsed]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsed(0);
    startTimeRef.current = null;
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  return { elapsed, isRunning, start, stop, reset };
}
