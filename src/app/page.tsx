// app/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AuthenticatedLayout from "./components/AuthenticatedLayout";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Force onboarding for the test account and anyone not onboarded
  const needsOnboarding =
    session.user.email?.toLowerCase() === "test@test.com" ||
    session.user.isOnboarded === false;
  if (needsOnboarding) redirect("/onboarding-one");

  // if you ever want a true "landing" behind login, you can show it here
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
              <span className="font-medium">{session.user?.email}</span>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
