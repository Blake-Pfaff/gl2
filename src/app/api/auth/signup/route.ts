// src/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email, password, name, bio } = await request.json();
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email & password required" },
      { status: 400 }
    );
  }
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  // create the user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, name, bio, hashedPassword },
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
