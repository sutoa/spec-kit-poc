import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import * as dotenv from 'dotenv';

import { createSchema } from './schema';
import { seedInstitutions } from './seed';

dotenv.config({ path: '../../.env' });

const dbPath = process.env.DATABASE_PATH || './data/financial-hub.db';

export let db: any; // Will be initialized asynchronously

async function initializeDatabase() {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.exec('PRAGMA journal_mode = WAL;');

  await createSchema();
  await seedInstitutions();
}

initializeDatabase().catch(err => {
  console.error('Error initializing database:', err);
  process.exit(1);
});
