import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';
import fs from 'fs';
import path from 'path';

// In-memory or local file for SQLite
const client = createClient({
  url: `file:app.db`,
});

export const db = drizzle(client, { schema });
