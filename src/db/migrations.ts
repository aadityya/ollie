import type { SQLiteDatabase } from 'expo-sqlite';

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS babies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      date_of_birth TEXT NOT NULL,
      gender TEXT,
      blood_type TEXT,
      allergies TEXT,
      pediatrician TEXT,
      photo_uri TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      baby_id TEXT NOT NULL,
      type TEXT NOT NULL,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      duration_seconds INTEGER,
      feed_type TEXT,
      bottle_amount_ml REAL,
      pee_amount TEXT,
      poop_color TEXT,
      poop_consistency TEXT,
      sleep_type TEXT,
      colic_intensity TEXT,
      colic_what_helped TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (baby_id) REFERENCES babies(id)
    );

    CREATE INDEX IF NOT EXISTS idx_activities_baby_date ON activities(baby_id, started_at);
    CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);

    CREATE TABLE IF NOT EXISTS milestones (
      id TEXT PRIMARY KEY,
      baby_id TEXT NOT NULL,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      expected_age_months_min INTEGER,
      expected_age_months_max INTEGER,
      achieved_at TEXT,
      notes TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (baby_id) REFERENCES babies(id)
    );

    CREATE INDEX IF NOT EXISTS idx_milestones_baby ON milestones(baby_id, category);

    CREATE TABLE IF NOT EXISTS growth_records (
      id TEXT PRIMARY KEY,
      baby_id TEXT NOT NULL,
      recorded_at TEXT NOT NULL,
      weight_kg REAL,
      height_cm REAL,
      head_circumference_cm REAL,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (baby_id) REFERENCES babies(id)
    );

    CREATE INDEX IF NOT EXISTS idx_growth_baby_date ON growth_records(baby_id, recorded_at);

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // v2 migration: add theme column to babies
  try {
    await db.execAsync(`ALTER TABLE babies ADD COLUMN theme TEXT`);
  } catch {
    // column already exists
  }

  // v3 migration: appointments, memories, happiness_records
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      baby_id TEXT NOT NULL,
      title TEXT NOT NULL,
      date_time TEXT NOT NULL,
      location TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (baby_id) REFERENCES babies(id)
    );
    CREATE INDEX IF NOT EXISTS idx_appointments_baby_date ON appointments(baby_id, date_time);

    CREATE TABLE IF NOT EXISTS memories (
      id TEXT PRIMARY KEY,
      baby_id TEXT NOT NULL,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (baby_id) REFERENCES babies(id)
    );
    CREATE INDEX IF NOT EXISTS idx_memories_baby_date ON memories(baby_id, date);

    CREATE TABLE IF NOT EXISTS happiness_records (
      id TEXT PRIMARY KEY,
      baby_id TEXT NOT NULL,
      date TEXT NOT NULL,
      score INTEGER NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (baby_id) REFERENCES babies(id)
    );
    CREATE INDEX IF NOT EXISTS idx_happiness_baby_date ON happiness_records(baby_id, date);
  `);

  // v4 migration: medications
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS medications (
      id TEXT PRIMARY KEY,
      baby_id TEXT NOT NULL,
      name TEXT NOT NULL,
      dosage TEXT,
      frequency TEXT,
      start_date TEXT NOT NULL,
      end_date TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (baby_id) REFERENCES babies(id)
    );
    CREATE INDEX IF NOT EXISTS idx_medications_baby ON medications(baby_id);
  `);
}
