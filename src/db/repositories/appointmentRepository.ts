import { getDatabase } from '../database';
import { Appointment } from '@/src/types';
import * as Crypto from 'expo-crypto';

function rowToAppointment(row: Record<string, unknown>): Appointment {
  return {
    id: row.id as string,
    babyId: row.baby_id as string,
    title: row.title as string,
    dateTime: row.date_time as string,
    location: row.location as string | undefined,
    notes: row.notes as string | undefined,
    createdAt: row.created_at as string,
  };
}

export async function getAppointments(babyId: string): Promise<Appointment[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync(
    'SELECT * FROM appointments WHERE baby_id = ? ORDER BY date_time DESC',
    [babyId]
  );
  return rows.map((r: any) => rowToAppointment(r as Record<string, unknown>));
}

export async function getUpcomingAppointments(babyId: string): Promise<Appointment[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync(
    "SELECT * FROM appointments WHERE baby_id = ? AND date_time >= datetime('now') ORDER BY date_time ASC",
    [babyId]
  );
  return rows.map((r: any) => rowToAppointment(r as Record<string, unknown>));
}

export async function insertAppointment(
  data: Omit<Appointment, 'id' | 'createdAt'>
): Promise<Appointment> {
  const db = await getDatabase();
  const id = Crypto.randomUUID();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO appointments (id, baby_id, title, date_time, location, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, data.babyId, data.title, data.dateTime, data.location ?? null, data.notes ?? null, now]
  );

  return { ...data, id, createdAt: now };
}

export async function updateAppointment(
  id: string,
  data: { title: string; dateTime: string; location?: string; notes?: string }
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE appointments SET title = ?, date_time = ?, location = ?, notes = ? WHERE id = ?',
    [data.title, data.dateTime, data.location ?? null, data.notes ?? null, id]
  );
}

export async function deleteAppointment(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM appointments WHERE id = ?', [id]);
}
