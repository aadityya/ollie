export type ThemeName = 'pastel' | 'earthy' | 'minimal' | 'dark' | 'midnight' | 'ocean' | 'lavender' | 'monochrome';

export type ActivityType = 'feed' | 'pee' | 'poop' | 'sleep' | 'colic' | 'tummy_time' | 'sun_time';

export type FeedType = 'breast_left' | 'breast_right' | 'bottle';
export type PeeAmount = 'light' | 'normal' | 'heavy';
export type PoopColor = 'yellow' | 'brown' | 'green';
export type PoopConsistency = 'liquid' | 'soft' | 'formed';
export type SleepType = 'nap' | 'night';
export type ColicIntensity = 'mild' | 'moderate' | 'severe';
export type MilestoneCategory = 'motor' | 'social' | 'language' | 'cognitive';

export interface Baby {
  id: string;
  name: string;
  dateOfBirth: string; // ISO 8601
  gender?: string;
  bloodType?: string;
  allergies?: string;
  pediatrician?: string;
  photoUri?: string;
  theme?: ThemeName;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  babyId: string;
  type: ActivityType;
  startedAt: string; // ISO 8601
  endedAt?: string;
  durationSeconds?: number;
  // Feed
  feedType?: FeedType;
  bottleAmountMl?: number;
  // Pee
  peeAmount?: PeeAmount;
  // Poop
  poopColor?: PoopColor;
  poopConsistency?: PoopConsistency;
  // Sleep
  sleepType?: SleepType;
  // Colic
  colicIntensity?: ColicIntensity;
  colicWhatHelped?: string;
  // Common
  notes?: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  babyId: string;
  category: MilestoneCategory;
  name: string;
  expectedAgeMonthsMin: number;
  expectedAgeMonthsMax: number;
  achievedAt?: string;
  notes?: string;
  sortOrder: number;
  createdAt: string;
}

export interface GrowthRecord {
  id: string;
  babyId: string;
  recordedAt: string;
  weightKg?: number;
  heightCm?: number;
  headCircumferenceCm?: number;
  notes?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  babyId: string;
  title: string;
  dateTime: string;
  location?: string;
  notes?: string;
  createdAt: string;
}

export interface Memory {
  id: string;
  babyId: string;
  title: string;
  date: string;
  description?: string;
  createdAt: string;
}

export interface Medication {
  id: string;
  babyId: string;
  name: string;
  dosage?: string;
  frequency?: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  createdAt: string;
}

export interface HappinessRecord {
  id: string;
  babyId: string;
  date: string;
  score: number; // 1-5
  notes?: string;
  createdAt: string;
}

export interface ActivityColorSet {
  bg: string;
  color: string;
}

export interface OlliePalette {
  bg: string;
  bgCard: string;
  bgSecondary: string;
  textPrimary: string;
  textSecondary: string;
  textLight: string;
  accent: string;
  accentLight: string;
  feed: ActivityColorSet;
  pee: ActivityColorSet;
  poop: ActivityColorSet;
  sleep: ActivityColorSet;
  colic: ActivityColorSet;
  navBg: string;
  navActive: string;
  navInactive: string;
  shadow: string;
  border: string;
  progressBg: string;
  success: string;
  radius: number;
  radiusSm: number;
}
