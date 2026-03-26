import NextAuth from "next-auth";
import type { RoleWithPermissionKeys } from "@/lib/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: RoleWithPermissionKeys;
      fullname: string;
    };
  }

  interface User {
    id: string;
    username: string;
    role: RoleWithPermissionKeys;
    fullname: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: RoleWithPermissionKeys;
    fullname: string;
  }
}
