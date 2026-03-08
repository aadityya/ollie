import { getDatabase } from '../database';
import { Medication } from '@/src/types';
import * as Crypto from 'expo-crypto';

function rowToMedication(row: Record<string, unknown>): Medication {
  return {
    id: row.id as string,
    babyId: row.baby_id as string,
    name: row.name as string,
    dosage: row.dosage as string | undefined,
    frequency: row.frequency as string | undefined,
    startDate: row.start_date as string,
    endDate: row.end_date as string | undefined,
    notes: row.notes as string | undefined,
    createdAt: row.created_at as string,
  };
}

export async function getMedications(babyId: string): Promise<Medication[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync(
    'SELECT * FROM medications WHERE baby_id = ? ORDER BY start_date DESC',
    [babyId]
  );
  return rows.map((r: any) => rowToMedication(r as Record<string, unknown>));
}

export async function insertMedication(
  data: Omit<Medication, 'id' | 'createdAt'>
): Promise<Medication> {
  const db = await getDatabase();
  const id = Crypto.randomUUID();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO medications (id, baby_id, name, dosage, frequency, start_date, end_date, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, data.babyId, data.name, data.dosage ?? null, data.frequency ?? null, data.startDate, data.endDate ?? null, data.notes ?? null, now]
  );

  return { ...data, id, createdAt: now };
}

export async function updateMedication(
  id: string,
  data: { name: string; dosage?: string; frequency?: string; startDate: string; endDate?: string; notes?: string }
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE medications SET name = ?, dosage = ?, frequency = ?, start_date = ?, end_date = ?, notes = ? WHERE id = ?',
    [data.name, data.dosage ?? null, data.frequency ?? null, data.startDate, data.endDate ?? null, data.notes ?? null, id]
  );
}

export async function deleteMedication(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM medications WHERE id = ?', [id]);
}
