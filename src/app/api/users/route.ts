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

export async function GET() {
  // 1) session check
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  // 2) safe to fetch
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
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
