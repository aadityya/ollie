import { getDatabase } from '../database';
import { GrowthRecord } from '@/src/types';
import * as Crypto from 'expo-crypto';

function rowToGrowthRecord(row: Record<string, unknown>): GrowthRecord {
  return {
    id: row.id as string,
    babyId: row.baby_id as string,
    recordedAt: row.recorded_at as string,
    weightKg: row.weight_kg as number | undefined,
    heightCm: row.height_cm as number | undefined,
    headCircumferenceCm: row.head_circumference_cm as number | undefined,
    notes: row.notes as string | undefined,
    createdAt: row.created_at as string,
  };
}

export async function getGrowthRecords(babyId: string): Promise<GrowthRecord[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync(
    'SELECT * FROM growth_records WHERE baby_id = ? ORDER BY recorded_at DESC',
    [babyId]
  );
  return rows.map((r: any) => rowToGrowthRecord(r as Record<string, unknown>));
}

export async function insertGrowthRecord(
  data: Omit<GrowthRecord, 'id' | 'createdAt'>
): Promise<GrowthRecord> {
  const db = await getDatabase();
  const id = Crypto.randomUUID();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO growth_records (id, baby_id, recorded_at, weight_kg, height_cm, head_circumference_cm, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.babyId,
      data.recordedAt,
      data.weightKg ?? null,
      data.heightCm ?? null,
      data.headCircumferenceCm ?? null,
      data.notes ?? null,
      now,
    ]
  );

  return { ...data, id, createdAt: now };
}

export async function deleteGrowthRecord(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM growth_records WHERE id = ?', [id]);
}
