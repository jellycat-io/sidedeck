import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function exportData() {
  const cards = await prisma.card.findMany();
  console.log(JSON.stringify(cards));
}

exportData()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
