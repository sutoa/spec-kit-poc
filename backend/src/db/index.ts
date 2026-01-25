import * as dotenv from 'dotenv';

import { createSchema } from './schema';
import { seedInstitutions } from './seed';

import Database from 'better-sqlite3';

dotenv.config({ path: '../../.env' });

const dbPath = process.env.DATABASE_PATH || './data/financial-hub.db';

export let db: any; // Will be initialized asynchronously

async function initializeDatabase() {
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  await createSchema();
  await seedInstitutions();
}

initializeDatabase().catch(err => {
  console.error('Error initializing database:', err);
  process.exit(1);
});
