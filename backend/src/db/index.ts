import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgres://catalin_ene:catalin_ene_pass@postgres:5432/catalin_ene_dev';

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
