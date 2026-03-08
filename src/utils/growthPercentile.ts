import {
  boysWeight,
  boysLength,
  girlsWeight,
  girlsLength,
  GrowthDataPoint,
} from '@/src/constants/whoGrowthData';

type MeasureType = 'weight' | 'height';

function getTable(gender: string, type: MeasureType): GrowthDataPoint[] {
  const isBoy = gender === 'boy';
  if (type === 'weight') return isBoy ? boysWeight : girlsWeight;
  return isBoy ? boysLength : girlsLength;
}

function getPercentileLabel(value: number, row: GrowthDataPoint): string {
  if (value < row.p3) return 'Below 3rd';
  if (value < row.p15) return '3rd–15th';
  if (value < row.p50) return '15th–50th';
  if (value < row.p85) return '50th–85th';
  if (value < row.p97) return '85th–97th';
  return 'Above 97th';
}

export function calculatePercentile(
  value: number,
  ageMonths: number,
  gender: string,
  type: MeasureType
): string | null {
  if (!gender || (gender !== 'boy' && gender !== 'girl')) return null;

  const table = getTable(gender, type);
  const rounded = Math.round(ageMonths);
  const clamped = Math.max(0, Math.min(24, rounded));
  const row = table.find((r) => r.ageMonths === clamped);
  if (!row) return null;

  return getPercentileLabel(value, row);
}

export function getBabyAgeMonths(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  return (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
}
