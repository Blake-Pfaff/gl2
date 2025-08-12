import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AuthenticatedLayout from "./components/AuthenticatedLayout";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // If no session, redirect to login
  if (!session) {
    redirect("/login");
  }

  // Check onboarding status
  const needsOnboarding = session.user.isOnboarded === false;

  console.log(`🏠 HOME PAGE CHECK for ${session.user.email}:`, {
    isOnboarded: session.user.isOnboarded,
    needsOnboarding,
    action: needsOnboarding ? "REDIRECT TO ONBOARDING" : "SHOW HOME",
  });

  if (needsOnboarding) {
    console.log(`🔄 REDIRECTING ${session.user.email} to onboarding`);
    redirect("/onboarding");
  }

  return (
    <AuthenticatedLayout>
      <div className="flex flex-col items-center justify-center p-component min-h-[calc(100vh-8rem)]">
        <div className="bg-white rounded-small shadow-md p-8 max-w-md w-full text-center">
          <h1 className="text-hero font-bold text-primary mb-4">
            👋 Welcome back!
          </h1>
          <p className="text-secondary mb-6">Ready to find your match?</p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-primary-500 to-purple-600 text-white p-component rounded-small">
              <p className="font-medium">Start swiping to meet new people!</p>
            </div>
            <div className="text-body text-muted">
              Logged in as:{" "}
              <span className="font-medium">{session.user.email}</span>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
