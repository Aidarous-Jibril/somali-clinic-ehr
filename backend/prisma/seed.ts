// //prisma/seed.ts
import { prisma } from "../src/config/prisma.js";

import { seedBNH } from "./seeders/bnh.seeder.js";
import { seedSCH } from "./seeders/sch.seeder.js";

async function main() {
  console.log("🌱 Seeding hospital...");

  await seedBNH();

  await seedSCH();

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });