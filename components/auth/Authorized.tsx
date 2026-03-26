"use client";

import { useSession } from "next-auth/react";
import { hasPermission } from "@/lib/authorization";

interface AuthorizedProps {
  permission: string;
  children: React.ReactNode;
}

export function Authorized({ permission, children }: AuthorizedProps) {
  const { data: session, status } = useSession();

  if (status === "loading") return null;
  if (!session?.user?.role) return null;

  if (!hasPermission(session.user.role, permission)) {
    return null;
  }

  return <>{children}</>;
}
