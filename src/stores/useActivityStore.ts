import { create } from 'zustand';
import { Activity, ActivityType } from '@/src/types';
import * as activityRepo from '@/src/db/repositories/activityRepository';

interface ActiveTimer {
  type: ActivityType;
  startedAt: number; // Date.now() timestamp
}

interface ActivityState {
  activeTimer: ActiveTimer | null;

  startTimer: (type: ActivityType) => void;
  stopTimer: () => number; // returns elapsed seconds
  resetTimer: () => void;
  getElapsed: () => number;

  saveActivity: (data: Omit<Activity, 'id' | 'createdAt'>) => Promise<Activity>;
  deleteActivity: (id: string) => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activeTimer: null,

  startTimer: (type) => {
    set({ activeTimer: { type, startedAt: Date.now() } });
  },

  stopTimer: () => {
    const timer = get().activeTimer;
    if (!timer) return 0;
    const elapsed = Math.floor((Date.now() - timer.startedAt) / 1000);
    set({ activeTimer: null });
    return elapsed;
  },

  resetTimer: () => {
    set({ activeTimer: null });
  },

  getElapsed: () => {
    const timer = get().activeTimer;
    if (!timer) return 0;
    return Math.floor((Date.now() - timer.startedAt) / 1000);
  },

  saveActivity: async (data) => {
    return activityRepo.insertActivity(data);
  },

  deleteActivity: async (id) => {
    await activityRepo.deleteActivity(id);
  },
}));
