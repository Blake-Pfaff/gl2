// scripts/seed-onboarding.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const onboardingSteps = [
  {
    stepNumber: 1,
    title: "Welcome to Goldy Locks !",
    description:
      "Goldy Locks is the dating app that makes sure things aren't too hot or too cold, thanks to our advanced user ranking system. Im Goldy your personal AI assistant, I'll help you find your perfect match.",
    imageUrl: "/goldyIntroM.png",
    imageAlt: "Introduction to Goldy Locks",
  },
  {
    stepNumber: 2,
    title: "Connecting can be awkward!",
    description:
      "You have your first match, but now… what do you say? You don't want to mess up the opportunity of meeting someone great just because you can't put your feelings into words.",
    imageUrl: "/glv2nervous.png",
    imageAlt: "Goldy looking nervous",
  },
  {
    stepNumber: 3,
    title: "Don't worry, Goldy—your personal AI assistant—is here to help!!",
    description:
      "Let Goldy scan the match's profile and yours to string together your feelings in a way you may struggle to. Tell Goldy if you want to be flirty, friendly, or just inquisitive, and let it find your words.",
    imageUrl: "/gLIdea.png",
    imageAlt: "Goldy having an idea",
  },
  {
    stepNumber: 4,
    title: "You got this!",
    description:
      "Now you can feel confident about expressing your feelings because Goldy always has your back.",
    imageUrl: "/glv2Confident.png",
    imageAlt: "Goldy looking confident",
  },
];

async function seedOnboardingSteps() {
  console.log("🎯 Seeding onboarding steps...");

  // Clear existing steps
  await prisma.onboardingStep.deleteMany({});

  // Create new steps
  const createdSteps = await prisma.onboardingStep.createMany({
    data: onboardingSteps,
  });

  console.log(`✅ Created ${createdSteps.count} onboarding steps`);
}

async function main() {
  try {
    await seedOnboardingSteps();
    console.log("🎉 Onboarding steps seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding onboarding steps:", error);
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
