import { ImageSourcePropType } from 'react-native';
import { ActivityType, OlliePalette, ActivityColorSet } from '@/src/types';
import { AppIcons } from '@/src/constants/icons';

interface ActivityMeta {
  icon: ImageSourcePropType;
  label: string;
  subtitle: string;
  getColors: (palette: OlliePalette) => ActivityColorSet;
}

export const activityMeta: Record<ActivityType, ActivityMeta> = {
  feed: {
    icon: AppIcons.feed,
    label: 'Feeding',
    subtitle: 'Breast / Bottle',
    getColors: (p) => p.feed,
  },
  sleep: {
    icon: AppIcons.sleep,
    label: 'Sleep',
    subtitle: 'Nap / Night',
    getColors: (p) => p.sleep,
  },
  pee: {
    icon: AppIcons.pee,
    label: 'Pee',
    subtitle: 'Wet diaper',
    getColors: (p) => p.pee,
  },
  poop: {
    icon: AppIcons.poop,
    label: 'Poop',
    subtitle: 'Dirty diaper',
    getColors: (p) => p.poop,
  },
  colic: {
    icon: AppIcons.colic,
    label: 'Colic',
    subtitle: 'Crying / Discomfort',
    getColors: (p) => p.colic,
  },
  tummy_time: {
    icon: AppIcons.bellyTime,
    label: 'Tummy Time',
    subtitle: 'Floor time',
    getColors: (p) => ({ bg: p.accentLight, color: p.accent }),
  },
  sun_time: {
    icon: AppIcons.sunTime,
    label: 'Sun Time',
    subtitle: 'Outdoor time',
    getColors: () => ({ bg: '#FFF8E1', color: '#F59E0B' }),
  },
};

export function getMetaForType(type: string): ActivityMeta {
  if (type in activityMeta) {
    return activityMeta[type as ActivityType];
  }
  return {
    icon: AppIcons.log,
    label: type,
    subtitle: 'Custom',
    getColors: (p) => ({ bg: p.bgSecondary, color: p.textPrimary }),
  };
}

export function getActivityTitle(activity: {
  type: string;
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
    case 'tummy_time':
      return 'Tummy Time';
    case 'sun_time':
      return 'Sun Time';
    default:
      return activity.type;
  }
}

export function getActivityDetail(activity: {
  type: string;
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
