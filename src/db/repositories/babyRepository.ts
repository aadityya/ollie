import { getDatabase } from '../database';
import { Baby } from '@/src/types';
import { v4 as uuid } from 'uuid';

function rowToBaby(row: Record<string, unknown>): Baby {
  return {
    id: row.id as string,
    name: row.name as string,
    dateOfBirth: row.date_of_birth as string,
    gender: row.gender as string | undefined,
    bloodType: row.blood_type as string | undefined,
    allergies: row.allergies as string | undefined,
    pediatrician: row.pediatrician as string | undefined,
    photoUri: row.photo_uri as string | undefined,
    isActive: (row.is_active as number) === 1,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getAllBabies(): Promise<Baby[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync('SELECT * FROM babies ORDER BY created_at');
  return rows.map((r) => rowToBaby(r as Record<string, unknown>));
}

export async function getActiveBaby(): Promise<Baby | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync('SELECT * FROM babies WHERE is_active = 1 LIMIT 1');
  return row ? rowToBaby(row as Record<string, unknown>) : null;
}

export async function insertBaby(data: {
  name: string;
  dateOfBirth: string;
  gender?: string;
}): Promise<Baby> {
  const db = await getDatabase();
  const id = uuid();
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT INTO babies (id, name, date_of_birth, gender, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, 1, ?, ?)`,
    [id, data.name, data.dateOfBirth, data.gender ?? null, now, now]
  );
  return {
    id,
    name: data.name,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
}

export async function updateBaby(
  id: string,
  data: Partial<Omit<Baby, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const db = await getDatabase();
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.dateOfBirth !== undefined) { fields.push('date_of_birth = ?'); values.push(data.dateOfBirth); }
  if (data.gender !== undefined) { fields.push('gender = ?'); values.push(data.gender); }
  if (data.bloodType !== undefined) { fields.push('blood_type = ?'); values.push(data.bloodType); }
  if (data.allergies !== undefined) { fields.push('allergies = ?'); values.push(data.allergies); }
  if (data.pediatrician !== undefined) { fields.push('pediatrician = ?'); values.push(data.pediatrician); }
  if (data.photoUri !== undefined) { fields.push('photo_uri = ?'); values.push(data.photoUri); }

  if (fields.length === 0) return;

  fields.push('updated_at = ?');
  values.push(new Date().toISOString());
  values.push(id);

  await db.runAsync(`UPDATE babies SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function setActiveBaby(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('UPDATE babies SET is_active = 0');
  await db.runAsync('UPDATE babies SET is_active = 1 WHERE id = ?', [id]);
}
