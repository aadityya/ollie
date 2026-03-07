import { create } from 'zustand';
import { Baby } from '@/src/types';
import * as babyRepo from '@/src/db/repositories/babyRepository';

interface BabyState {
  babies: Baby[];
  activeBaby: Baby | null;
  isLoaded: boolean;

  loadBabies: () => Promise<void>;
  addBaby: (data: { name: string; dateOfBirth: string; gender?: string }) => Promise<Baby>;
  updateBaby: (id: string, data: Partial<Omit<Baby, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  setActiveBaby: (id: string) => Promise<void>;
}

export const useBabyStore = create<BabyState>((set, get) => ({
  babies: [],
  activeBaby: null,
  isLoaded: false,

  loadBabies: async () => {
    const babies = await babyRepo.getAllBabies();
    const active = await babyRepo.getActiveBaby();
    set({ babies, activeBaby: active, isLoaded: true });
  },

  addBaby: async (data) => {
    const baby = await babyRepo.insertBaby(data);
    const babies = await babyRepo.getAllBabies();
    set({ babies, activeBaby: baby });
    return baby;
  },

  updateBaby: async (id, data) => {
    await babyRepo.updateBaby(id, data);
    const babies = await babyRepo.getAllBabies();
    const active = babies.find((b) => b.isActive) ?? null;
    set({ babies, activeBaby: active });
  },

  setActiveBaby: async (id) => {
    await babyRepo.setActiveBaby(id);
    const babies = await babyRepo.getAllBabies();
    const active = babies.find((b) => b.isActive) ?? null;
    set({ babies, activeBaby: active });
  },
}));
