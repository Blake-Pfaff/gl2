import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import OnboardingOneClient from "./OnboardingOneClient";

export default async function OnboardingOnePage() {
  // Protect this page with authentication but don't use AuthenticatedLayout
  // since onboarding has its own custom layout
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return <OnboardingOneClient />;
}
