import { getDatabase } from '../database';
import { HappinessRecord } from '@/src/types';
import * as Crypto from 'expo-crypto';

function rowToHappiness(row: Record<string, unknown>): HappinessRecord {
  return {
    id: row.id as string,
    babyId: row.baby_id as string,
    date: row.date as string,
    score: row.score as number,
    notes: row.notes as string | undefined,
    createdAt: row.created_at as string,
  };
}

export async function getHappinessForDate(
  babyId: string,
  date: string
): Promise<HappinessRecord | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync(
    'SELECT * FROM happiness_records WHERE baby_id = ? AND date = ?',
    [babyId, date]
  );
  return row ? rowToHappiness(row as Record<string, unknown>) : null;
}

export async function getHappinessForDateRange(
  babyId: string,
  startDate: string,
  endDate: string
): Promise<HappinessRecord[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync(
    'SELECT * FROM happiness_records WHERE baby_id = ? AND date >= ? AND date <= ? ORDER BY date ASC',
    [babyId, startDate, endDate]
  );
  return rows.map((r: any) => rowToHappiness(r as Record<string, unknown>));
}

export async function upsertHappiness(
  data: Omit<HappinessRecord, 'id' | 'createdAt'>
): Promise<HappinessRecord> {
  const db = await getDatabase();
  const existing = await getHappinessForDate(data.babyId, data.date);

  if (existing) {
    await db.runAsync(
      'UPDATE happiness_records SET score = ?, notes = ? WHERE id = ?',
      [data.score, data.notes ?? null, existing.id]
    );
    return { ...existing, score: data.score, notes: data.notes };
  }

  const id = Crypto.randomUUID();
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT INTO happiness_records (id, baby_id, date, score, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, data.babyId, data.date, data.score, data.notes ?? null, now]
  );
  return { ...data, id, createdAt: now };
}

export async function deleteHappiness(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM happiness_records WHERE id = ?', [id]);
}
