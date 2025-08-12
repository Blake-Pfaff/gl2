// prisma/seed.js
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Constants for seeding
const NUM_USERS = 50; // total desired users INCLUDING the preserved test user
const PRESERVE_EMAIL = "test@test.com";
const NUM_PHOTOS_PER_USER = faker.number.int({ min: 1, max: 6 });
const INTERACTION_PROBABILITY = 0.15; // 15% chance any two users interact
const BLOCK_PROBABILITY = 0.02; // 2% chance of blocking
const MESSAGE_PROBABILITY = 0.3; // 30% of matches have messages

const INTERACTION_TYPES = ["LIKE", "DISLIKE", "SUPERLIKE"];
const GENDER_OPTIONS = [
  "WOMAN",
  "MAN",
  "NON_BINARY",
  "GENDERFLUID",
  "AGENDER",
  "TRANSGENDER_WOMAN",
  "TRANSGENDER_MAN",
  "QUESTIONING",
  "PREFER_NOT_TO_SAY",
  "OTHER",
];
const LOOKING_FOR_OPTIONS = ["WOMEN", "MEN", "NON_BINARY_PEOPLE", "EVERYONE"];
const JOB_TITLES = [
  "Software Engineer",
  "Graphic Designer",
  "Teacher",
  "Nurse",
  "Doctor",
  "Marketing Manager",
  "Sales Representative",
  "Photographer",
  "Writer",
  "Architect",
  "Chef",
  "Personal Trainer",
  "Therapist",
  "Accountant",
  "Lawyer",
  "Artist",
  "Musician",
  "Data Scientist",
  "Product Manager",
  "Consultant",
  "Real Estate Agent",
  "Veterinarian",
  "Pharmacist",
  "Social Worker",
  "Engineer",
  "Designer",
  "Developer",
  "Manager",
];

const PHOTO_URLS = [
  "https://images.unsplash.com/photo-1494790108755-2616c27d6a60?w=400",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
  "https://images.unsplash.com/photo-1539571696-3b4924efc46b?w=400",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f62?w=400",
  "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400",
  "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400",
];

async function createUsers(count = NUM_USERS) {
  console.log("🧑‍🤝‍🧑 Creating users...");

  const defaultPassword = "password123";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const users = [];

  // Generate random users (we'll handle the preserved test user separately)
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const birthdate = faker.date.birthdate({ min: 18, max: 65, mode: "age" });
    const gender = faker.helpers.arrayElement(GENDER_OPTIONS);

    users.push({
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      username: faker.internet.userName({ firstName, lastName }).toLowerCase(),
      name: `${firstName} ${lastName}`,
      jobTitle: faker.helpers.arrayElement(JOB_TITLES),
      bio: generateRandomBio(),
      birthdate: birthdate,
      phone: faker.helpers.maybe(() => faker.phone.number(), {
        probability: 0.7,
      }), // 70% have phone
      gender: gender,
      lookingFor: faker.helpers.arrayElement(LOOKING_FOR_OPTIONS),
      lastOnlineAt: faker.date.recent({ days: 30 }),
      locationLabel: `${faker.location.city()}, ${faker.location.state({
        abbreviated: true,
      })}`,
      hashedPassword: hashedPassword,
    });
  }

  const createdUsers = await prisma.user.createManyAndReturn({
    data: users,
  });

  console.log(`✅ Created ${createdUsers.length} users`);
  return createdUsers;
}

function generateRandomBio() {
  const interests = [
    "hiking",
    "reading",
    "cooking",
    "traveling",
    "photography",
    "music",
    "dancing",
    "yoga",
    "fitness",
    "art",
    "movies",
    "gaming",
    "swimming",
    "cycling",
    "running",
    "wine tasting",
    "coffee",
    "dogs",
    "cats",
    "rock climbing",
    "surfing",
    "skiing",
    "painting",
    "writing",
    "meditation",
  ];

  const selectedInterests = faker.helpers.arrayElements(interests, {
    min: 2,
    max: 4,
  });

  const bioTemplates = [
    `Love ${selectedInterests.join(", ")}. ${faker.lorem.sentence()}`,
    `Passionate about ${selectedInterests.join(
      " and "
    )}. ${faker.lorem.sentence()}`,
    `My hobbies include ${selectedInterests.join(
      ", "
    )}. ${faker.lorem.sentence()}`,
    `Into ${selectedInterests.join(
      ", "
    )}. Looking for someone to explore life with! ${faker.lorem.sentence()}`,
    `${selectedInterests.join(", ")} enthusiast. ${faker.lorem.sentences(2)}`,
    `Adventure seeker who loves ${selectedInterests.join(
      " and "
    )}. ${faker.lorem.sentence()}`,
  ];

  return faker.helpers.arrayElement(bioTemplates);
}

async function createUserLocations(users) {
  console.log("📍 Creating user locations...");

  const locations = users.map((user) => ({
    userId: user.id,
    latitude: faker.location.latitude({ min: 25.0, max: 49.0 }), // US boundaries roughly
    longitude: faker.location.longitude({ min: -125.0, max: -65.0 }),
  }));

  await prisma.userLocation.createMany({
    data: locations,
  });

  console.log(`✅ Created ${locations.length} user locations`);
}

async function createPhotos(users) {
  console.log("📸 Creating user photos...");

  const photos = [];

  for (const user of users) {
    const numPhotos = faker.number.int({ min: 1, max: 5 });

    for (let i = 0; i < numPhotos; i++) {
      photos.push({
        userId: user.id,
        url: faker.helpers.arrayElement(PHOTO_URLS),
        caption: i === 0 ? null : faker.lorem.sentence(), // First photo usually no caption
        order: i,
        isMain: i === 0, // First photo is main photo
      });
    }
  }

  await prisma.photo.createMany({
    data: photos,
  });

  console.log(`✅ Created ${photos.length} photos`);
}

async function createInteractions(users) {
  console.log("💕 Creating user interactions...");

  const interactions = [];

  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      // Random chance for user i to interact with user j
      if (Math.random() < INTERACTION_PROBABILITY) {
        interactions.push({
          fromId: users[i].id,
          toId: users[j].id,
          type: faker.helpers.arrayElement(INTERACTION_TYPES),
        });
      }

      // Random chance for user j to interact with user i (separate interaction)
      if (Math.random() < INTERACTION_PROBABILITY) {
        interactions.push({
          fromId: users[j].id,
          toId: users[i].id,
          type: faker.helpers.arrayElement(INTERACTION_TYPES),
        });
      }
    }
  }

  // Remove duplicates (shouldn't happen with our logic, but just in case)
  const uniqueInteractions = interactions.filter(
    (interaction, index, self) =>
      index ===
      self.findIndex(
        (i) => i.fromId === interaction.fromId && i.toId === interaction.toId
      )
  );

  await prisma.interaction.createMany({
    data: uniqueInteractions,
  });

  console.log(`✅ Created ${uniqueInteractions.length} interactions`);
  return uniqueInteractions;
}

async function createBlocks(users) {
  console.log("🚫 Creating user blocks...");

  const blocks = [];

  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < users.length; j++) {
      if (i !== j && Math.random() < BLOCK_PROBABILITY) {
        const reasons = [
          "Inappropriate behavior",
          "Spam",
          "Harassment",
          "Fake profile",
          "Not interested",
          null, // Sometimes no reason
        ];

        blocks.push({
          blockerId: users[i].id,
          blockedId: users[j].id,
          reason: faker.helpers.arrayElement(reasons),
        });
      }
    }
  }

  // Remove duplicates manually since SQLite doesn't support skipDuplicates
  const uniqueBlocks = blocks.filter(
    (block, index, self) =>
      index ===
      self.findIndex(
        (b) =>
          b.blockerId === block.blockerId && b.blockedId === block.blockedId
      )
  );

  await prisma.block.createMany({
    data: uniqueBlocks,
  });

  console.log(`✅ Created ${uniqueBlocks.length} blocks`);
}

async function createMatches(users, interactions) {
  console.log("💑 Creating matches...");

  // Find mutual likes to create matches
  const mutualLikes = [];

  for (const interaction of interactions) {
    if (interaction.type === "LIKE") {
      // Check if there's a reciprocal like
      const reciprocal = interactions.find(
        (i) =>
          i.fromId === interaction.toId &&
          i.toId === interaction.fromId &&
          i.type === "LIKE"
      );

      if (reciprocal) {
        // Make sure we don't add duplicate matches
        const matchExists = mutualLikes.some(
          (match) =>
            (match.aId === interaction.fromId &&
              match.bId === interaction.toId) ||
            (match.aId === interaction.toId && match.bId === interaction.fromId)
        );

        if (!matchExists) {
          mutualLikes.push({
            aId: interaction.fromId,
            bId: interaction.toId,
          });
        }
      }
    }
  }

  const createdMatches = await prisma.match.createManyAndReturn({
    data: mutualLikes,
  });

  console.log(`✅ Created ${createdMatches.length} matches`);
  return createdMatches;
}

async function createMessages(matches, users) {
  console.log("💬 Creating messages...");

  const messages = [];

  for (const match of matches) {
    if (Math.random() < MESSAGE_PROBABILITY) {
      const numMessages = faker.number.int({ min: 1, max: 12 });
      const participants = [match.aId, match.bId];

      for (let i = 0; i < numMessages; i++) {
        const senderId = faker.helpers.arrayElement(participants);
        const messageTemplates = [
          "Hey! How's your day going?",
          "I love your photos! Where was that taken?",
          "Thanks for matching with me! 😊",
          "What do you like to do for fun?",
          "Have you been to that new restaurant downtown?",
          "Your bio made me laugh! Great sense of humor",
          "Want to grab coffee sometime?",
          "What kind of music are you into?",
          "I see you're into hiking too! Any favorite trails?",
          "Hope you're having a great week!",
          "That's so cool! Tell me more about that",
          "Same here! We have a lot in common",
        ];

        messages.push({
          matchId: match.id,
          senderId: senderId,
          body: faker.helpers.arrayElement(messageTemplates),
          createdAt: faker.date.recent({ days: 30 }),
        });
      }
    }
  }

  // Sort messages by creation date to make conversations more realistic
  messages.sort((a, b) => a.createdAt - b.createdAt);

  await prisma.message.createMany({
    data: messages,
  });

  console.log(`✅ Created ${messages.length} messages`);
}

async function main() {
  console.log("🌱 Starting database seed...\n");

  try {
    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await prisma.message.deleteMany({});
    await prisma.match.deleteMany({});
    await prisma.block.deleteMany({});
    await prisma.interaction.deleteMany({});
    await prisma.photo.deleteMany({});
    await prisma.userLocation.deleteMany({});
    // Delete all users EXCEPT the preserved account
    await prisma.user.deleteMany({ where: { email: { not: PRESERVE_EMAIL } } });
    console.log("✅ Cleared existing data\n");

    // Ensure preserved test account exists (or recreate it) with known password/state
    const defaultPassword = "password123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    const testHashedPassword = await bcrypt.hash("testpass", 10);
    const testUser = await prisma.user.upsert({
      where: { email: PRESERVE_EMAIL },
      update: {
        name: "Test User",
        username: "testuser",
        jobTitle: "Software Engineer",
        bio: "I'm a test user for development purposes. Love hiking, coding, and good coffee!",
        birthdate: new Date("1990-01-15"),
        phone: "+1-555-0123",
        gender: "NON_BINARY",
        lookingFor: "EVERYONE",
        lastOnlineAt: faker.date.recent({ days: 1 }),
        locationLabel: "San Francisco, CA",
        hashedPassword: testHashedPassword,
        isOnboarded: false,
        firstLoginAt: null,
      },
      create: {
        email: PRESERVE_EMAIL,
        name: "Test User",
        username: "testuser",
        jobTitle: "Software Engineer",
        bio: "I'm a test user for development purposes. Love hiking, coding, and good coffee!",
        birthdate: new Date("1990-01-15"),
        phone: "+1-555-0123",
        gender: "NON_BINARY",
        lookingFor: "EVERYONE",
        lastOnlineAt: faker.date.recent({ days: 1 }),
        locationLabel: "San Francisco, CA",
        hashedPassword: testHashedPassword,
        isOnboarded: false,
      },
    });

    // Create test@example.com user for testing (onboarded)
    const testExampleUser = await prisma.user.upsert({
      where: { email: "test@example.com" },
      update: {
        name: "Example User",
        username: "exampleuser",
        jobTitle: "Software Engineer",
        bio: "I'm a test user for testing. Love hiking and coffee!",
        birthdate: new Date("1990-01-15"),
        phone: "+1-555-9999",
        gender: "NON_BINARY",
        lookingFor: "EVERYONE",
        lastOnlineAt: faker.date.recent({ days: 1 }),
        locationLabel: "San Francisco, CA",
        hashedPassword,
        isOnboarded: true,
        firstLoginAt: new Date(),
      },
      create: {
        email: "test@example.com",
        name: "Example User",
        username: "exampleuser",
        jobTitle: "Software Engineer",
        bio: "I'm a test user for testing. Love hiking and coffee!",
        birthdate: new Date("1990-01-15"),
        phone: "+1-555-9999",
        gender: "NON_BINARY",
        lookingFor: "EVERYONE",
        lastOnlineAt: faker.date.recent({ days: 1 }),
        locationLabel: "San Francisco, CA",
        hashedPassword,
        isOnboarded: true,
        firstLoginAt: new Date(),
      },
    });

    // Create remaining users
    const otherUsers = await createUsers(NUM_USERS - 2);
    const users = [testUser, testExampleUser, ...otherUsers];
    await createUserLocations(users);
    await createPhotos(users);
    const interactions = await createInteractions(users);
    await createBlocks(users);
    const matches = await createMatches(users, interactions);
    await createMessages(matches, users);

    console.log("\n🎉 Database seeded successfully!");
    console.log(`
📊 Summary:
- ${users.length} users created (including preserved ${PRESERVE_EMAIL})
- ${users.length} locations created
- Photos created for all users
- ${interactions.length} interactions created
- Blocks created (small percentage)
- ${matches.length} matches created
- Messages created for ${Math.round(
      matches.length * MESSAGE_PROBABILITY
    )} matches

🔐 Default password for all users: "password123"
📧 Preserved test user email: ${PRESERVE_EMAIL}
    `);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
