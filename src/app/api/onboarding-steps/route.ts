import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const steps = await prisma.onboardingStep.findMany({
      where: { isActive: true },
      orderBy: { stepNumber: "asc" },
      select: {
        id: true,
        stepNumber: true,
        title: true,
        description: true,
        imageUrl: true,
        imageAlt: true,
      },
    });

    return NextResponse.json(steps);
  } catch (error) {
    console.error("Error fetching onboarding steps:", error);
    return NextResponse.json(
      { error: "Failed to fetch onboarding steps" },
      { status: 500 }
    );
  }
}
