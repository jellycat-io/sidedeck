import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = `${process.env.DATABASE_PRISMA_URL}`;

const pool = new Pool({
  connectionString,
});
const adapter = new PrismaNeon(pool);

export const db = globalThis.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}
