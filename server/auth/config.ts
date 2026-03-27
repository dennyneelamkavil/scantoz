import "server-only";

import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { verifyUser } from "@/server/user/user.service";

import type { RoleWithPermissionKeys } from "@/lib/types";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(creds) {
        const schema = z.object({
          username: z.string().min(3),
          password: z.string().min(6),
        });

        const parsed = schema.safeParse(creds);
        if (!parsed.success) {
          throw new Error("Invalid username or password");
        }

        const user = await verifyUser(
          parsed.data.username,
          parsed.data.password,
        );

        if (!user) {
          throw new Error("Invalid username or password");
        }

        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.name = user.name;
        token.userType = user.userType;
        token.companyId = user.companyId || null;

        // only for admin
        token.role = user.role || null;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        username: token.username as string,
        name: token.name as string,
        userType: token.userType as "admin" | "customer",
        companyId: token.companyId as string | null,
        role: token.role as RoleWithPermissionKeys | null,
      };

      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },
};
