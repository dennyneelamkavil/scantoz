import NextAuth from "next-auth";
import type { RoleWithPermissionKeys } from "@/lib/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      name: string;

      userType: "admin" | "customer";
      companyId: string | null;

      role: RoleWithPermissionKeys | null;
    };
  }

  interface User {
    id: string;
    username: string;
    name: string;

    userType: "admin" | "customer";
    companyId?: string | null;

    role?: RoleWithPermissionKeys | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    name: string;

    userType: "admin" | "customer";
    companyId?: string | null;

    role?: RoleWithPermissionKeys | null;
  }
}
