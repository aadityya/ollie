import { create } from 'zustand';
import { ThemeName } from '@/src/types';
import * as settingsRepo from '@/src/db/repositories/settingsRepository';

interface SettingsState {
  theme: ThemeName;
  feedReminderEnabled: boolean;
  napReminderEnabled: boolean;
  medicineReminderEnabled: boolean;
  onboardingCompleted: boolean;
  isLoaded: boolean;

  loadSettings: () => Promise<void>;
  setTheme: (theme: ThemeName) => void;
  toggleFeedReminder: () => void;
  toggleNapReminder: () => void;
  toggleMedicineReminder: () => void;
  setOnboardingCompleted: (completed: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: 'pastel',
  feedReminderEnabled: true,
  napReminderEnabled: true,
  medicineReminderEnabled: false,
  onboardingCompleted: false,
  isLoaded: false,

  loadSettings: async () => {
    try {
      const all = await settingsRepo.getAllSettings();
      set({
        theme: (all.theme as ThemeName) || 'pastel',
        feedReminderEnabled: all.feed_reminder !== 'false',
        napReminderEnabled: all.nap_reminder !== 'false',
        medicineReminderEnabled: all.medicine_reminder === 'true',
        onboardingCompleted: all.onboarding_completed === 'true',
        isLoaded: true,
      });
    } catch {
      set({ isLoaded: true });
    }
  },

  setTheme: (theme) => {
    set({ theme });
    settingsRepo.setSetting('theme', theme).catch(() => {});
  },

  toggleFeedReminder: () => {
    const newVal = !get().feedReminderEnabled;
    set({ feedReminderEnabled: newVal });
    settingsRepo.setSetting('feed_reminder', String(newVal)).catch(() => {});
  },

  toggleNapReminder: () => {
    const newVal = !get().napReminderEnabled;
    set({ napReminderEnabled: newVal });
    settingsRepo.setSetting('nap_reminder', String(newVal)).catch(() => {});
  },

  toggleMedicineReminder: () => {
    const newVal = !get().medicineReminderEnabled;
    set({ medicineReminderEnabled: newVal });
    settingsRepo.setSetting('medicine_reminder', String(newVal)).catch(() => {});
  },

  setOnboardingCompleted: (completed) => {
    set({ onboardingCompleted: completed });
    settingsRepo.setSetting('onboarding_completed', String(completed)).catch(() => {});
  },
}));
