import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AuthenticatedLayout from "../components/AuthenticatedLayout";
import UsersGrid from "../components/UsersGrid";

export default async function UserIndexPage() {
  const session = await getServerSession(authOptions);

  // If no session, redirect to login
  if (!session) {
    redirect("/login");
  }

  // Check onboarding status
  const needsOnboarding = session.user.isOnboarded === false;

  if (needsOnboarding) {
    redirect("/onboarding");
  }

  return (
    <AuthenticatedLayout>
      <div className="p-component">
        <div className="max-w-7xl mx-auto">
          <div className="mb-section">
            <h1 className="text-hero font-bold text-primary mb-2">
              Discover Users
            </h1>
            <p className="text-body text-secondary">
              Find and connect with other users in your area
            </p>
          </div>

          <UsersGrid />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
