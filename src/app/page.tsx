// app/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // if you ever want a true “landing” behind login, you can show it here
  return <h1>👋 Welcome back, {session.user?.email}!</h1>;
}
