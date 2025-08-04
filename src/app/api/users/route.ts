import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const { email, name, bio } = await request.json();
  const user = await prisma.user.create({
    data: { email, name, bio },
  });
  return NextResponse.json(user, { status: 201 });
}
