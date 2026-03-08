import { useState, useEffect, useCallback } from 'react';
import * as activityRepo from '@/src/db/repositories/activityRepository';
import * as happinessRepo from '@/src/db/repositories/happinessRepository';

interface DaySummary {
  date: string;
  label: string;
  feedCount: number;
  peeCount: number;
  poopCount: number;
  sleepMinutes: number;
  colicCount: number;
  happinessScore: number | null;
}

export type InsightRange = 'day' | 'week' | 'month';

export function useInsightsData(babyId: string | null, range: InsightRange) {
  const [data, setData] = useState<DaySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!babyId) return;
    setIsLoading(true);

    const now = new Date();
    const days = range === 'day' ? 1 : range === 'week' ? 7 : 30;
    const summaries: DaySummary[] = [];

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - (days - 1));
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = now.toISOString().split('T')[0];

    const happinessRecords = await happinessRepo.getHappinessForDateRange(
      babyId,
      startStr,
      endStr
    );
    const happinessMap = new Map(happinessRecords.map((h) => [h.date, h.score]));

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

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

      let label: string;
      if (range === 'day') {
        label = 'Today';
      } else if (range === 'week') {
        label = dayLabels[d.getDay()];
      } else {
        label = d.getDate() % 5 === 0 || d.getDate() === 1 ? String(d.getDate()) : '';
      }

      summaries.push({
        date: dateStr,
        label,
        feedCount,
        peeCount,
        poopCount,
        sleepMinutes,
        colicCount,
        happinessScore: happinessMap.get(dateStr) ?? null,
      });
    }

    // Group by week for month view
    if (range === 'month') {
      const weeks: DaySummary[] = [];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let w = 0; w < summaries.length; w += 7) {
        const chunk = summaries.slice(w, w + 7);
        const first = new Date(chunk[0].date);
        const weekLabel = `${monthNames[first.getMonth()]} ${first.getDate()}`;
        weeks.push({
          date: chunk[0].date,
          label: weekLabel,
          feedCount: chunk.reduce((s, d) => s + d.feedCount, 0),
          peeCount: chunk.reduce((s, d) => s + d.peeCount, 0),
          poopCount: chunk.reduce((s, d) => s + d.poopCount, 0),
          sleepMinutes: chunk.reduce((s, d) => s + d.sleepMinutes, 0),
          colicCount: chunk.reduce((s, d) => s + d.colicCount, 0),
          happinessScore: (() => {
            const scores = chunk.map((d) => d.happinessScore).filter((s): s is number => s !== null);
            return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
          })(),
        });
      }
      setData(weeks);
    } else {
      setData(summaries);
    }
    setIsLoading(false);
  }, [babyId, range]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, isLoading, refresh };
}
