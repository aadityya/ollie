import { create } from 'zustand';
import { Activity } from '@/src/types';
import * as activityRepo from '@/src/db/repositories/activityRepository';
import { addDays, subDays, isToday } from 'date-fns';

interface TimelineState {
  selectedDate: Date;
  activities: Activity[];
  isLoading: boolean;

  setSelectedDate: (date: Date) => void;
  goToPreviousDay: () => void;
  goToNextDay: () => void;
  loadActivities: (babyId: string) => Promise<void>;
}

export const useTimelineStore = create<TimelineState>((set, get) => ({
  selectedDate: new Date(),
  activities: [],
  isLoading: false,

  setSelectedDate: (date) => set({ selectedDate: date }),

  goToPreviousDay: () => {
    set((s) => ({ selectedDate: subDays(s.selectedDate, 1) }));
  },

  goToNextDay: () => {
    const next = addDays(get().selectedDate, 1);
    if (!isToday(get().selectedDate)) {
      set({ selectedDate: next });
    }
  },

  loadActivities: async (babyId) => {
    set({ isLoading: true });
    const dateStr = get().selectedDate.toISOString().split('T')[0];
    const activities = await activityRepo.getActivitiesForDate(babyId, dateStr);
    set({ activities, isLoading: false });
  },
}));
