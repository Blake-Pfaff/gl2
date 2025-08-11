import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import OnboardingFourClient from "./OnboardingFourClient";

export default async function OnboardingFourPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return <OnboardingFourClient />;
}
