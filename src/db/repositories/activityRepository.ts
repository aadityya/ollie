import { getDatabase } from '../database';
import { Activity, ActivityType } from '@/src/types';
import * as Crypto from 'expo-crypto';

function rowToActivity(row: Record<string, unknown>): Activity {
  return {
    id: row.id as string,
    babyId: row.baby_id as string,
    type: row.type as ActivityType,
    startedAt: row.started_at as string,
    endedAt: row.ended_at as string | undefined,
    durationSeconds: row.duration_seconds as number | undefined,
    feedType: row.feed_type as Activity['feedType'],
    bottleAmountMl: row.bottle_amount_ml as number | undefined,
    peeAmount: row.pee_amount as Activity['peeAmount'],
    poopColor: row.poop_color as Activity['poopColor'],
    poopConsistency: row.poop_consistency as Activity['poopConsistency'],
    sleepType: row.sleep_type as Activity['sleepType'],
    colicIntensity: row.colic_intensity as Activity['colicIntensity'],
    colicWhatHelped: row.colic_what_helped as string | undefined,
    notes: row.notes as string | undefined,
    createdAt: row.created_at as string,
  };
}

export async function getActivitiesForDate(
  babyId: string,
  dateStr: string
): Promise<Activity[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync(
    `SELECT * FROM activities
     WHERE baby_id = ? AND date(started_at) = date(?)
     ORDER BY started_at DESC`,
    [babyId, dateStr]
  );
  return rows.map((r: any) => rowToActivity(r as Record<string, unknown>));
}

export async function getTodaySummary(
  babyId: string
): Promise<{
  feedCount: number;
  peeCount: number;
  poopCount: number;
  sleepMinutes: number;
  colicCount: number;
  tummyTimeMinutes: number;
  sunTimeMinutes: number;
  lastActivity: Activity | null;
}> {
  const db = await getDatabase();
  const today = new Date().toISOString().split('T')[0];

  const counts = await db.getFirstAsync(
    `SELECT
       COALESCE(SUM(CASE WHEN type = 'feed' THEN 1 ELSE 0 END), 0) as feed_count,
       COALESCE(SUM(CASE WHEN type = 'pee' THEN 1 ELSE 0 END), 0) as pee_count,
       COALESCE(SUM(CASE WHEN type = 'poop' THEN 1 ELSE 0 END), 0) as poop_count,
       COALESCE(SUM(CASE WHEN type = 'colic' THEN 1 ELSE 0 END), 0) as colic_count,
       COALESCE(SUM(CASE WHEN type = 'sleep' THEN duration_seconds ELSE 0 END), 0) / 60 as sleep_minutes,
       COALESCE(SUM(CASE WHEN type = 'tummy_time' THEN duration_seconds ELSE 0 END), 0) / 60 as tummy_time_minutes,
       COALESCE(SUM(CASE WHEN type = 'sun_time' THEN duration_seconds ELSE 0 END), 0) / 60 as sun_time_minutes
     FROM activities
     WHERE baby_id = ? AND date(started_at) = date(?)`,
    [babyId, today]
  );

  const lastRow = await db.getFirstAsync(
    `SELECT * FROM activities
     WHERE baby_id = ? AND date(started_at) = date(?)
     ORDER BY started_at DESC LIMIT 1`,
    [babyId, today]
  );

  return {
    feedCount: counts?.feed_count ?? 0,
    peeCount: counts?.pee_count ?? 0,
    poopCount: counts?.poop_count ?? 0,
    sleepMinutes: counts?.sleep_minutes ?? 0,
    colicCount: counts?.colic_count ?? 0,
    tummyTimeMinutes: counts?.tummy_time_minutes ?? 0,
    sunTimeMinutes: counts?.sun_time_minutes ?? 0,
    lastActivity: lastRow ? rowToActivity(lastRow as Record<string, unknown>) : null,
  };
}

export async function insertActivity(
  data: Omit<Activity, 'id' | 'createdAt'>
): Promise<Activity> {
  const db = await getDatabase();
  const id = Crypto.randomUUID();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO activities (
      id, baby_id, type, started_at, ended_at, duration_seconds,
      feed_type, bottle_amount_ml, pee_amount,
      poop_color, poop_consistency, sleep_type,
      colic_intensity, colic_what_helped, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.babyId, data.type, data.startedAt, data.endedAt ?? null,
      data.durationSeconds ?? null, data.feedType ?? null,
      data.bottleAmountMl ?? null, data.peeAmount ?? null,
      data.poopColor ?? null, data.poopConsistency ?? null,
      data.sleepType ?? null, data.colicIntensity ?? null,
      data.colicWhatHelped ?? null, data.notes ?? null, now,
    ]
  );

  return { ...data, id, createdAt: now };
}

export async function deleteActivity(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM activities WHERE id = ?', [id]);
}

export async function getActivitiesForDateRange(
  babyId: string,
  startDate: string,
  endDate: string
): Promise<Activity[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync(
    `SELECT * FROM activities
     WHERE baby_id = ? AND date(started_at) >= date(?) AND date(started_at) <= date(?)
     ORDER BY started_at DESC`,
    [babyId, startDate, endDate]
  );
  return rows.map((r: any) => rowToActivity(r as Record<string, unknown>));
}
