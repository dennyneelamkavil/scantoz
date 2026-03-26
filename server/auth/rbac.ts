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
  role: RoleWithPermissionKeys;
};

export async function requirePermission(permissions: string | string[]) {
  // 1️⃣ Try NextAuth session (browser)
  const session = await getServerSession(authOptions);

  let role: RoleWithPermissionKeys | undefined;

  if (session?.user?.role) {
    role = session.user.role;
  }

  // 2️⃣ Fallback to Bearer token (Postman / API)
  if (!role) {
    const hdrs = await headers();
    const authHeader = hdrs.get("authorization");

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      role = decoded.role;
    }
  }

  // 3️⃣ No auth at all
  if (!role) {
    throw new Error("Unauthorized");
  }

  // 4️⃣ Permission check (includes super-admin bypass)
  if (!hasPermission(role, permissions)) {
    throw new Error("Forbidden");
  }
}
