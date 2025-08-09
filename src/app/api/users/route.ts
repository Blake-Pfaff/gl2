// src/app/api/users/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const globalForPrisma = globalThis as unknown & { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(request: Request) {
  // 1) session check
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) Parse pagination parameters
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const offset = (page - 1) * limit;

  try {
    // Add debug logging to see what we get from the session
    console.log("Session user:", session.user);

    // 3) Fetch users excluding current user with pagination
    const whereClause = session.user?.id
      ? { id: { not: session.user.id } } // Exclude current user if ID exists
      : {}; // Show all users if no ID (fallback)

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          jobTitle: true,
          locationLabel: true,
          photos: {
            where: {
              isMain: true,
            },
            select: {
              url: true,
            },
            take: 1,
          },
        },
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.user.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // 1) session check
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  // 2) parse + validate
  const { email, name, bio } = await request.json();
  if (!email || !name) {
    return NextResponse.json(
      { error: "Email and name are required" },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    );
  }

  // 3) create
  const user = await prisma.user.create({ data: { email, name, bio } });
  return NextResponse.json(user, { status: 201 });
}
