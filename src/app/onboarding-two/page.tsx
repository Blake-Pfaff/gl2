import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import OnboardingTwoClient from "./OnboardingTwoClient";

export default async function OnboardingTwoPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return <OnboardingTwoClient />;
}
