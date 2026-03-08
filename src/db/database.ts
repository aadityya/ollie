import { Platform } from 'react-native';
import { runMigrations } from './migrations';

let db: any = null;

export async function getDatabase() {
  if (Platform.OS === 'web') {
    throw new Error('expo-sqlite is not supported on web');
  }
  if (!db) {
    const SQLite = require('expo-sqlite');
    db = await SQLite.openDatabaseAsync('ollie.db');
    await db.execAsync('PRAGMA journal_mode = WAL;');
    await runMigrations(db);
  }
  return db;
}

export async function resetDatabase(): Promise<void> {
  const database = await getDatabase();
  await database.execAsync(`
    DELETE FROM activities;
    DELETE FROM milestones;
    DELETE FROM growth_records;
    DELETE FROM appointments;
    DELETE FROM memories;
    DELETE FROM happiness_records;
    DELETE FROM settings;
    DELETE FROM babies;
  `);
}
