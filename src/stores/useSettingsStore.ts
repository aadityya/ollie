import { create } from 'zustand';
import { ThemeName } from '@/src/types';
import * as settingsRepo from '@/src/db/repositories/settingsRepository';

interface SettingsState {
  theme: ThemeName;
  feedReminderEnabled: boolean;
  napReminderEnabled: boolean;
  medicineReminderEnabled: boolean;
  onboardingCompleted: boolean;
  userName: string;
  customActivityTypes: string[];
  isLoaded: boolean;

  loadSettings: () => Promise<void>;
  setTheme: (theme: ThemeName) => void;
  toggleFeedReminder: () => void;
  toggleNapReminder: () => void;
  toggleMedicineReminder: () => void;
  setOnboardingCompleted: (completed: boolean) => void;
  setUserName: (name: string) => void;
  addCustomActivityType: (type: string) => void;
  updateCustomActivityType: (oldType: string, newType: string) => void;
  removeCustomActivityType: (type: string) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: 'monochrome',
  feedReminderEnabled: true,
  napReminderEnabled: true,
  medicineReminderEnabled: false,
  onboardingCompleted: false,
  userName: 'Mom',
  customActivityTypes: [],
  isLoaded: false,

  loadSettings: async () => {
    try {
      const all = await settingsRepo.getAllSettings();
      set({
        theme: (all.theme as ThemeName) || 'monochrome',
        feedReminderEnabled: all.feed_reminder !== 'false',
        napReminderEnabled: all.nap_reminder !== 'false',
        medicineReminderEnabled: all.medicine_reminder === 'true',
        onboardingCompleted: all.onboarding_completed === 'true',
        userName: all.user_name || 'Mom',
        customActivityTypes: all.custom_activity_types ? JSON.parse(all.custom_activity_types) : [],
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

  setUserName: (name) => {
    set({ userName: name });
    settingsRepo.setSetting('user_name', name).catch(() => {});
  },

  addCustomActivityType: (type) => {
    const types = [...get().customActivityTypes, type];
    set({ customActivityTypes: types });
    settingsRepo.setSetting('custom_activity_types', JSON.stringify(types)).catch(() => {});
  },

  updateCustomActivityType: (oldType, newType) => {
    const types = get().customActivityTypes.map((t) => (t === oldType ? newType : t));
    set({ customActivityTypes: types });
    settingsRepo.setSetting('custom_activity_types', JSON.stringify(types)).catch(() => {});
  },

  removeCustomActivityType: (type) => {
    const types = get().customActivityTypes.filter((t) => t !== type);
    set({ customActivityTypes: types });
    settingsRepo.setSetting('custom_activity_types', JSON.stringify(types)).catch(() => {});
  },
}));
