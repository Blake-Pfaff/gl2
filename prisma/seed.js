// prisma/seed.js
// ← adjust this path if your folder layout differs
const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();

async function main() {
  const users = Array.from({ length: 20 }, (_, i) => ({
    email: `user${i + 1}@example.com`,
    name: `User ${i + 1}`,
    bio: `This is user ${i + 1}`,
  }));

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log("✅ Seeded 20 users");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
