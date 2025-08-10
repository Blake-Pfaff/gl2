// src/app/api/user/phone/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Helper function to require authentication
async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null; // No error, session is valid
}

export async function PUT(request: Request) {
  // 1) Check authentication
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  try {
    // 2) Parse and validate request body
    const { phoneNumber, countryCode } = await request.json();

    if (!phoneNumber || !countryCode) {
      return NextResponse.json(
        { error: "Phone number and country code are required" },
        { status: 400 }
      );
    }

    // 3) Format the complete phone number
    const fullPhoneNumber = `${countryCode} ${phoneNumber}`.trim();

    // 4) Check if phone number is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        phone: fullPhoneNumber,
        NOT: { id: userId }, // Exclude current user
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "This phone number is already registered to another account" },
        { status: 409 }
      );
    }

    // 5) Update the user's phone number
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        phone: fullPhoneNumber,
        lastOnlineAt: new Date(), // Update last online time too
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        lastOnlineAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Phone number updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating phone number:", error);
    return NextResponse.json(
      { error: "Failed to update phone number" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // 1) Check authentication
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  try {
    // 2) Get user's current phone number
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      phone: user.phone,
    });
  } catch (error) {
    console.error("Error fetching phone number:", error);
    return NextResponse.json(
      { error: "Failed to fetch phone number" },
      { status: 500 }
    );
  }
}
