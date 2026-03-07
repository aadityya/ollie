import { useState, useEffect, useCallback } from 'react';
import { Activity } from '@/src/types';
import * as activityRepo from '@/src/db/repositories/activityRepository';

interface TodaySummary {
  feedCount: number;
  peeCount: number;
  poopCount: number;
  sleepMinutes: number;
  colicCount: number;
  lastActivity: Activity | null;
}

export function useTodaySummary(babyId: string | null) {
  const [summary, setSummary] = useState<TodaySummary>({
    feedCount: 0,
    peeCount: 0,
    poopCount: 0,
    sleepMinutes: 0,
    colicCount: 0,
    lastActivity: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!babyId) return;
    setIsLoading(true);
    const data = await activityRepo.getTodaySummary(babyId);
    setSummary(data);
    setIsLoading(false);
  }, [babyId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { summary, isLoading, refresh };
}
