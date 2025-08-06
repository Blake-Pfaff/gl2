// prisma/seed.js
const bcrypt = require("bcrypt");
const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();

async function main() {
  const defaultPassword = "test";
  const hashed = await bcrypt.hash(defaultPassword, 10);

  // Build an array that starts with your test user…
  const users = [
    {
      email: "test@gmail.com",
      name: "Test User",
      bio: "Seeded test user",
      hashedPassword: hashed,
    },
    // …then 20 random users
    ...Array.from({ length: 20 }, (_, i) => ({
      email: `user${i + 1}@example.com`,
      name: `User ${i + 1}`,
      bio: `This is user ${i + 1}`,
      hashedPassword: hashed,
    })),
  ];

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log(
    "✅ Seeded test user and 20 random users with password:",
    defaultPassword
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
