import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/");
  }
  
  return session;
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/");
  }
  
  const userRole = (session.user as any)?.role;
  
  if (userRole !== "admin") {
    redirect("/");
  }
  
  return session;
}
