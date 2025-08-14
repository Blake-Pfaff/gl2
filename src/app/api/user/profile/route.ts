import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,
        jobTitle: true,
        birthdate: true,
        gender: true,
        lookingFor: true,
        locationLabel: true,
        photos: {
          select: {
            id: true,
            url: true,
            caption: true,
            order: true,
            isMain: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bio, jobTitle, gender, lookingFor, locationLabel } = body;

    // Validate bio length (255 chars max)
    if (bio && bio.length > 255) {
      return NextResponse.json(
        { error: "Bio must be 255 characters or less" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        bio: bio?.trim() || null,
        jobTitle: jobTitle?.trim() || null,
        gender: gender || null,
        lookingFor: lookingFor || null,
        locationLabel: locationLabel?.trim() || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,
        jobTitle: true,
        birthdate: true,
        gender: true,
        lookingFor: true,
        locationLabel: true,
        photos: {
          select: {
            id: true,
            url: true,
            caption: true,
            order: true,
            isMain: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
