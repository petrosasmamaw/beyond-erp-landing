import { PrismaClient } from "@prisma/client";
import { seedDatabase } from "../src/seed.js";

const prisma = new PrismaClient();

seedDatabase(prisma)
  .then(async () => {
    console.log("Seed data ready.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
