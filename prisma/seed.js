// prisma/seed.js
const bcrypt = require("bcrypt");
const { PrismaClient } = require("../src/generated/prisma"); // or '@prisma/client' if you removed the custom output
const prisma = new PrismaClient();

async function main() {
  // 1. Hash the default password once
  const defaultPassword = "password123";
  const hashed = await bcrypt.hash(defaultPassword, 10);

  // 2. Build 20 users with email, name, bio, AND hashedPassword
  const users = Array.from({ length: 20 }, (_, i) => ({
    email: `user${i + 1}@example.com`,
    name: `User ${i + 1}`,
    bio: `This is user ${i + 1}`,
    hashedPassword: hashed,
  }));

  // 3. Bulk-insert, skipping duplicates
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log("✅ Seeded 20 users with default password:", defaultPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
