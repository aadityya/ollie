import { ActivityType, OlliePalette, ActivityColorSet } from '@/src/types';

interface ActivityMeta {
  icon: string;
  label: string;
  subtitle: string;
  getColors: (palette: OlliePalette) => ActivityColorSet;
}

export const activityMeta: Record<ActivityType, ActivityMeta> = {
  feed: {
    icon: '🍼',
    label: 'Feeding',
    subtitle: 'Breast / Bottle',
    getColors: (p) => p.feed,
  },
  sleep: {
    icon: '😴',
    label: 'Sleep',
    subtitle: 'Nap / Night',
    getColors: (p) => p.sleep,
  },
  pee: {
    icon: '💧',
    label: 'Pee',
    subtitle: 'Wet diaper',
    getColors: (p) => p.pee,
  },
  poop: {
    icon: '💩',
    label: 'Poop',
    subtitle: 'Dirty diaper',
    getColors: (p) => p.poop,
  },
  colic: {
    icon: '😢',
    label: 'Colic',
    subtitle: 'Crying / Discomfort',
    getColors: (p) => p.colic,
  },
};

export function getActivityTitle(activity: {
  type: ActivityType;
  feedType?: string;
  sleepType?: string;
}): string {
  switch (activity.type) {
    case 'feed':
      if (activity.feedType === 'breast_left') return 'Breastfed (Left)';
      if (activity.feedType === 'breast_right') return 'Breastfed (Right)';
      if (activity.feedType === 'bottle') return 'Bottle Fed';
      return 'Fed';
    case 'sleep':
      return activity.sleepType === 'night' ? 'Night Sleep' : 'Nap';
    case 'pee':
      return 'Wet Diaper';
    case 'poop':
      return 'Dirty Diaper';
    case 'colic':
      return 'Colic Episode';
  }
}

export function getActivityDetail(activity: {
  type: ActivityType;
  durationSeconds?: number;
  feedType?: string;
  bottleAmountMl?: number;
  peeAmount?: string;
  poopColor?: string;
  poopConsistency?: string;
  colicIntensity?: string;
  colicWhatHelped?: string;
}): string {
  const parts: string[] = [];

  if (activity.durationSeconds) {
    const m = Math.floor(activity.durationSeconds / 60);
    const h = Math.floor(m / 60);
    if (h > 0) {
      parts.push(`${h}h ${m % 60}m`);
    } else {
      parts.push(`${m} min`);
    }
  }

  switch (activity.type) {
    case 'feed':
      if (activity.feedType?.startsWith('breast')) {
        parts.unshift(activity.feedType === 'breast_left' ? 'Left side' : 'Right side');
      }
      if (activity.bottleAmountMl) parts.push(`${activity.bottleAmountMl}ml`);
      break;
    case 'pee':
      if (activity.peeAmount) parts.push(capitalize(activity.peeAmount));
      break;
    case 'poop':
      if (activity.poopColor) parts.push(capitalize(activity.poopColor));
      if (activity.poopConsistency) parts.push(activity.poopConsistency);
      break;
    case 'colic':
      if (activity.colicIntensity) parts.push(capitalize(activity.colicIntensity));
      if (activity.colicWhatHelped) parts.push(activity.colicWhatHelped);
      break;
  }

  return parts.join(' — ') || '';
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
