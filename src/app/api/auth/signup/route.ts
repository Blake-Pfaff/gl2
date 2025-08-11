// src/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email, password, name, username, bio } = await request.json();
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email & password required" },
      { status: 400 }
    );
  }

  // Check if email already exists
  const emailExists = await prisma.user.findUnique({ where: { email } });
  if (emailExists) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 409 }
    );
  }

  // Check if username already exists (if provided)
  if (username) {
    const usernameExists = await prisma.user.findUnique({
      where: { username },
    });
    if (usernameExists) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }
  }

  // create the user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, name, username, bio, hashedPassword },
  });

  // create an Ethereal test account and transporter
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // send a “realistic” test email
  const info = await transporter.sendMail({
    from: `"MyApp Dev" <${testAccount.user}>`,
    to: email,
    subject: "Welcome to MyApp!",
    html: `
      <h1>Welcome, ${name ?? email}!</h1>
      <p>You’ve successfully signed up at <a href="http://localhost:3000">MyApp</a>.</p>
    `,
  });

  // log the Ethereal preview URL
  console.log("Preview email at:", nodemailer.getTestMessageUrl(info));

  return NextResponse.json(
    {
      id: user.id,
      email: user.email,
      preview: nodemailer.getTestMessageUrl(info),
    },
    { status: 201 }
  );
}
