// importData.ts
import { PrismaClient } from '@prisma/client';

import { readFileSync } from 'fs';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_PROD } },
});

async function importData() {
  const data = readFileSync('cards.json', 'utf8');
  const cards = JSON.parse(data);

  for (const card of cards) {
    await prisma.card
      .create({
        data: card,
      })
      .catch((e) => console.error(`Error inserting card: ${card.id}`, e));
  }
}

importData()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
