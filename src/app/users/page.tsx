import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AuthenticatedLayout from "../components/AuthenticatedLayout";
import UsersGrid from "../components/UsersGrid";

export default async function UserIndexPage() {
  // Protect this page with authentication
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <AuthenticatedLayout>
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Discover Users
            </h1>
            <p className="text-gray-600">
              Find and connect with other users in your area
            </p>
          </div>

          <UsersGrid />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
