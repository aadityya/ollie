import * as babyRepo from '@/src/db/repositories/babyRepository';
import * as activityRepo from '@/src/db/repositories/activityRepository';
import * as growthRepo from '@/src/db/repositories/growthRepository';
import { FeedType, PeeAmount, PoopColor, PoopConsistency, SleepType, ColicIntensity } from '@/src/types';

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTime(date: Date, hourMin: number, hourMax: number): string {
  const d = new Date(date);
  d.setHours(rand(hourMin, hourMax), rand(0, 59), rand(0, 59), 0);
  return d.toISOString();
}

const FEED_TYPES: FeedType[] = ['breast_left', 'breast_right', 'bottle'];
const PEE_AMOUNTS: PeeAmount[] = ['light', 'normal', 'heavy'];
const POOP_COLORS: PoopColor[] = ['yellow', 'brown', 'green'];
const POOP_CONSISTENCIES: PoopConsistency[] = ['liquid', 'soft', 'formed'];
const COLIC_INTENSITIES: ColicIntensity[] = ['mild', 'moderate', 'severe'];
const COLIC_HELPERS = ['Rocking', 'Swaddling', 'White noise', 'Car ride', 'Pacifier', 'Warm bath', 'Tummy massage'];

async function generateActivitiesForDay(babyId: string, date: Date) {
  // Feeds: 6-8 per day
  const feedCount = rand(6, 8);
  for (let i = 0; i < feedCount; i++) {
    const feedType = pick(FEED_TYPES);
    const durationSeconds = rand(300, 1200); // 5-20 min
    const startedAt = randomTime(date, 6 + Math.floor(i * 2), 7 + Math.floor(i * 2));
    const endedAt = new Date(new Date(startedAt).getTime() + durationSeconds * 1000).toISOString();
    await activityRepo.insertActivity({
      babyId,
      type: 'feed',
      startedAt,
      endedAt,
      durationSeconds,
      feedType,
      bottleAmountMl: feedType === 'bottle' ? rand(60, 180) : undefined,
    });
  }

  // Sleep: 3-4 naps + 1 night
  const napCount = rand(3, 4);
  for (let i = 0; i < napCount; i++) {
    const durationSeconds = rand(1800, 7200); // 30-120 min
    const hour = pick([9, 11, 13, 15, 17].slice(0, napCount));
    const startedAt = randomTime(date, hour, hour + 1);
    const endedAt = new Date(new Date(startedAt).getTime() + durationSeconds * 1000).toISOString();
    await activityRepo.insertActivity({
      babyId,
      type: 'sleep',
      startedAt,
      endedAt,
      durationSeconds,
      sleepType: 'nap' as SleepType,
    });
  }
  // Night sleep
  const nightDuration = rand(21600, 36000); // 6-10 hrs
  const nightStart = new Date(date);
  nightStart.setHours(rand(19, 21), rand(0, 30), 0, 0);
  const nightEnd = new Date(nightStart.getTime() + nightDuration * 1000);
  await activityRepo.insertActivity({
    babyId,
    type: 'sleep',
    startedAt: nightStart.toISOString(),
    endedAt: nightEnd.toISOString(),
    durationSeconds: nightDuration,
    sleepType: 'night' as SleepType,
  });

  // Pee: 5-8 per day
  const peeCount = rand(5, 8);
  for (let i = 0; i < peeCount; i++) {
    await activityRepo.insertActivity({
      babyId,
      type: 'pee',
      startedAt: randomTime(date, 6 + Math.floor(i * 2), 8 + Math.floor(i * 2)),
      peeAmount: pick(PEE_AMOUNTS),
    });
  }

  // Poop: 2-4 per day
  const poopCount = rand(2, 4);
  for (let i = 0; i < poopCount; i++) {
    await activityRepo.insertActivity({
      babyId,
      type: 'poop',
      startedAt: randomTime(date, 7 + i * 4, 10 + i * 4),
      poopColor: pick(POOP_COLORS),
      poopConsistency: pick(POOP_CONSISTENCIES),
    });
  }

  // Colic: 0-1 per day
  if (Math.random() < 0.3) {
    const durationSeconds = rand(300, 2400); // 5-40 min
    const startedAt = randomTime(date, 17, 21);
    const endedAt = new Date(new Date(startedAt).getTime() + durationSeconds * 1000).toISOString();
    await activityRepo.insertActivity({
      babyId,
      type: 'colic',
      startedAt,
      endedAt,
      durationSeconds,
      colicIntensity: pick(COLIC_INTENSITIES),
      colicWhatHelped: pick(COLIC_HELPERS),
    });
  }
}

async function generateGrowthRecords(
  babyId: string,
  startDate: Date,
  weeks: number,
  startWeight: number,
  startHeight: number,
  startHead: number,
  weightGain: number,
  heightGain: number,
  headGain: number
) {
  for (let w = 0; w < weeks; w++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + w * 7);
    // Add slight randomness to growth
    const jitter = () => (Math.random() - 0.5) * 0.1;
    await growthRepo.insertGrowthRecord({
      babyId,
      recordedAt: d.toISOString().split('T')[0],
      weightKg: Math.round((startWeight + w * weightGain + jitter()) * 100) / 100,
      heightCm: Math.round((startHeight + w * heightGain + jitter()) * 10) / 10,
      headCircumferenceCm: Math.round((startHead + w * headGain + jitter()) * 10) / 10,
    });
  }
}

export async function generateMockData(): Promise<string> {
  // Create Jane (6 months old)
  const jane = await babyRepo.insertBaby({
    name: 'Jane',
    dateOfBirth: '2025-09-07',
  });
  await babyRepo.updateBaby(jane.id, { theme: 'lavender' });

  // Create Jack (3 months old)
  const jack = await babyRepo.insertBaby({
    name: 'Jack',
    dateOfBirth: '2025-12-07',
  });
  await babyRepo.updateBaby(jack.id, { theme: 'ocean' });

  // Generate 90 days of activities for each baby
  const now = new Date();
  for (let daysAgo = 89; daysAgo >= 0; daysAgo--) {
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(0, 0, 0, 0);

    await generateActivitiesForDay(jane.id, date);
    await generateActivitiesForDay(jack.id, date);
  }

  // Growth records: weekly for 13 weeks (3 months)
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 89);

  // Jane: ~6 months old, starting around 5.5kg
  await generateGrowthRecords(jane.id, threeMonthsAgo, 13, 5.5, 58, 39, 0.15, 0.5, 0.3);

  // Jack: ~3 months old, starting around 4.0kg
  await generateGrowthRecords(jack.id, threeMonthsAgo, 13, 4.0, 52, 36, 0.2, 0.6, 0.35);

  // Set Jane as active
  await babyRepo.setActiveBaby(jane.id);

  return jane.id;
}
