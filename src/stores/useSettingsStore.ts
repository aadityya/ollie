import { create } from 'zustand';
import { ThemeName } from '@/src/types';
import * as settingsRepo from '@/src/db/repositories/settingsRepository';

interface SettingsState {
  theme: ThemeName;
  feedReminderEnabled: boolean;
  napReminderEnabled: boolean;
  onboardingCompleted: boolean;
  userName: string;
  isLoaded: boolean;

  loadSettings: () => Promise<void>;
  setTheme: (theme: ThemeName) => void;
  toggleFeedReminder: () => void;
  toggleNapReminder: () => void;
  setOnboardingCompleted: (completed: boolean) => void;
  setUserName: (name: string) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: 'monochrome',
  feedReminderEnabled: true,
  napReminderEnabled: true,
  onboardingCompleted: false,
  userName: 'Mom',
  isLoaded: false,

  loadSettings: async () => {
    try {
      const all = await settingsRepo.getAllSettings();
      set({
        theme: (all.theme as ThemeName) || 'monochrome',
        feedReminderEnabled: all.feed_reminder !== 'false',
        napReminderEnabled: all.nap_reminder !== 'false',
        onboardingCompleted: all.onboarding_completed === 'true',
        userName: all.user_name || 'Mom',
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

  setOnboardingCompleted: (completed) => {
    set({ onboardingCompleted: completed });
    settingsRepo.setSetting('onboarding_completed', String(completed)).catch(() => {});
  },

  setUserName: (name) => {
    set({ userName: name });
    settingsRepo.setSetting('user_name', name).catch(() => {});
  },

}));
