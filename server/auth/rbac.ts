import "server-only";

import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

import { authOptions } from "@/server/auth/config";
import { hasPermission } from "@/lib/authorization";

import type { RoleWithPermissionKeys } from "@/lib/types";

type JwtPayload = {
  sub: string;
  username: string;
  role?: RoleWithPermissionKeys;
  userType: "admin" | "customer";
  companyId?: string;
};

export async function requirePermission(permissions: string | string[]) {
  const session = await getServerSession(authOptions);

  let role: RoleWithPermissionKeys | undefined;
  let userType: "admin" | "customer" | undefined;

  if (session?.user) {
    role = session.user.role || undefined;
    userType = session.user.userType;
  }

  // fallback for API
  if (!userType) {
    const hdrs = await headers();
    const authHeader = hdrs.get("authorization");

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      role = decoded.role;
      userType = decoded.userType;
    }
  }

  // ❌ No auth
  if (!userType) {
    throw new Error("Unauthorized");
  }

  // 🔥 Customers DO NOT use RBAC
  if (userType === "customer") {
    return;
  }

  // ❌ Admin but no role
  if (!role) {
    throw new Error("Forbidden");
  }

  if (!hasPermission(role, permissions)) {
    throw new Error("Forbidden");
  }
}
