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
