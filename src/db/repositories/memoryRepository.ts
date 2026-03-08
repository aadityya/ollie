import { getDatabase } from '../database';
import { Memory } from '@/src/types';
import * as Crypto from 'expo-crypto';

function rowToMemory(row: Record<string, unknown>): Memory {
  return {
    id: row.id as string,
    babyId: row.baby_id as string,
    title: row.title as string,
    date: row.date as string,
    description: row.description as string | undefined,
    createdAt: row.created_at as string,
  };
}

export async function getMemories(babyId: string): Promise<Memory[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync(
    'SELECT * FROM memories WHERE baby_id = ? ORDER BY date DESC',
    [babyId]
  );
  return rows.map((r: any) => rowToMemory(r as Record<string, unknown>));
}

export async function insertMemory(
  data: Omit<Memory, 'id' | 'createdAt'>
): Promise<Memory> {
  const db = await getDatabase();
  const id = Crypto.randomUUID();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO memories (id, baby_id, title, date, description, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, data.babyId, data.title, data.date, data.description ?? null, now]
  );

  return { ...data, id, createdAt: now };
}

export async function updateMemory(
  id: string,
  data: { title: string; date: string; description?: string }
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE memories SET title = ?, date = ?, description = ? WHERE id = ?',
    [data.title, data.date, data.description ?? null, id]
  );
}

export async function deleteMemory(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM memories WHERE id = ?', [id]);
}
