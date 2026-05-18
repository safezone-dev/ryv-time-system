import {
    getServerSession,
  } from "next-auth";
  
  import { authOptions } from "@/lib/auth";
  
  import {
    redirect,
  } from "next/navigation";
  
  export async function requireAdmin() {
    const session =
      await getServerSession(
        authOptions
      );
  
    if (
      session?.user?.role !==
      "ADMIN"
    ) {
      redirect(
        "/dashboard"
      );
    }
  
    return session;
  }
  
  export async function requireExecutiveOrAdmin() {
    const session =
      await getServerSession(
        authOptions
      );
  
    if (
      session?.user?.role !==
        "ADMIN" &&
      session?.user?.role !==
        "EXECUTIVE"
    ) {
      redirect(
        "/dashboard"
      );
    }
  
    return session;
  }
  
  export async function requireAuth() {
    const session =
      await getServerSession(
        authOptions
      );
  
    if (!session) {
      redirect("/login");
    }
  
    return session;
  }