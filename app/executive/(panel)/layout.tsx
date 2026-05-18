import ExecutiveSidebar from "@/components/executive/executive-sidebar";

import {
  getServerSession,
} from "next-auth";

import { authOptions } from "@/lib/auth";

import { redirect } from "next/navigation";

export default async function ExecutiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // SESSION
  const session =
    await getServerSession(
      authOptions
    );

  // NO SESSION
  if (!session) {
    redirect(
      "/executive/login"
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <ExecutiveSidebar
        userName={
          session.user.name ||
          "Executive"
        }
        userEmail={
          session.user.email ||
          ""
        }
      />

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}