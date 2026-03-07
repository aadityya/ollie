import { format, differenceInMonths, differenceInWeeks, differenceInMinutes, differenceInHours, isToday, parseISO } from 'date-fns';

export function calculateAge(dateOfBirth: string): string {
  const dob = parseISO(dateOfBirth);
  const now = new Date();
  const months = differenceInMonths(now, dob);
  const weeks = differenceInWeeks(now, dob) - months * 4;

  if (months === 0) {
    const totalWeeks = differenceInWeeks(now, dob);
    return `${totalWeeks} week${totalWeeks !== 1 ? 's' : ''} old`;
  }

  if (weeks > 0) {
    return `${months} month${months !== 1 ? 's' : ''}, ${weeks} week${weeks !== 1 ? 's' : ''} old`;
  }
  return `${months} month${months !== 1 ? 's' : ''} old`;
}

export function formatTimeAgo(dateStr: string): string {
  const date = parseISO(dateStr);
  const now = new Date();
  const mins = differenceInMinutes(now, date);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins !== 1 ? 's' : ''} ago`;

  const hours = differenceInHours(now, date);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;

  return format(date, 'MMM d, h:mm a');
}

export function formatTime(dateStr: string): string {
  return format(parseISO(dateStr), 'h:mm a');
}

export function formatDateLabel(date: Date): string {
  if (isToday(date)) {
    return `Today, ${format(date, 'MMM d')}`;
  }
  return format(date, 'EEE, MMM d');
}

export function getTimeOfDayGroup(dateStr: string): 'night' | 'morning' | 'afternoon' | 'evening' {
  const hour = parseISO(dateStr).getHours();
  if (hour < 6) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 20) return 'evening';
  return 'night';
}

export function getTimeOfDayLabel(group: string): string {
  const labels: Record<string, string> = {
    night: '🌙 Night',
    morning: '🌅 Morning',
    afternoon: '☀️ Afternoon',
    evening: '🌇 Evening',
  };
  return labels[group] ?? group;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export function formatTimerDisplay(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 17) return 'Good afternoon,';
  return 'Good evening,';
}

export function todayDateStr(): string {
  return new Date().toISOString().split('T')[0];
}
