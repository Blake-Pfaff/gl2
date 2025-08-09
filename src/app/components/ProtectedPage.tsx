import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface ProtectedPageProps {
  children: ReactNode;
  redirectTo?: string;
}

export default async function ProtectedPage({
  children,
  redirectTo = "/login",
}: ProtectedPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
