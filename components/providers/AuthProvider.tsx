"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const value = useMemo<AuthContextType>(
    () => ({
      user: session?.user
        ? {
            id: session.user.id,
            username: session.user.username,
          }
        : null,

      isLoading: status === "loading",

      async login(username: string, password: string) {
        const res = await signIn("credentials", {
          username,
          password,
          redirect: false,
        });

        if (!res || !res.ok) {
          throw new Error(res?.error || "Invalid username or password");
        }
      },

      async logout() {
        await signOut({ redirect: true });
      },
    }),
    [session, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
