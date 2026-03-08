import { useState, useEffect, useCallback } from 'react';
import { ActivityType } from '@/src/types';
import * as activityRepo from '@/src/db/repositories/activityRepository';

interface DaySummary {
  date: string;
  label: string;
  feedCount: number;
  peeCount: number;
  poopCount: number;
  sleepMinutes: number;
  colicCount: number;
}

export type InsightRange = 'day' | 'week';

export function useInsightsData(babyId: string | null, range: InsightRange) {
  const [data, setData] = useState<DaySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!babyId) return;
    setIsLoading(true);

    const now = new Date();
    const days = range === 'day' ? 1 : 7;
    const summaries: DaySummary[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      const activities = await activityRepo.getActivitiesForDate(babyId, dateStr);

      let feedCount = 0;
      let peeCount = 0;
      let poopCount = 0;
      let sleepMinutes = 0;
      let colicCount = 0;

      for (const a of activities) {
        switch (a.type) {
          case 'feed': feedCount++; break;
          case 'pee': peeCount++; break;
          case 'poop': poopCount++; break;
          case 'sleep': sleepMinutes += Math.round((a.durationSeconds ?? 0) / 60); break;
          case 'colic': colicCount++; break;
        }
      }

      summaries.push({
        date: dateStr,
        label: range === 'day' ? 'Today' : dayLabels[d.getDay()],
        feedCount,
        peeCount,
        poopCount,
        sleepMinutes,
        colicCount,
      });
    }

    setData(summaries);
    setIsLoading(false);
  }, [babyId, range]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, isLoading, refresh };
}
