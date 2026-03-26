import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * 🔐 Route → Required Permission
 * Add new routes & permissions here
 */
const PERMISSION_ROUTES: Array<{
  path: RegExp;
  permission: string;
}> = [
  {
    path: /^\/permissions/,
    permission: "permission:read",
  },
  {
    path: /^\/roles/,
    permission: "role:read",
  },
  {
    path: /^\/users/,
    permission: "user:read",
  },
];

const AUTH_PAGES = ["/signin"];

/* ================= CORS CONFIG ================= */
const ALLOWED_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_ADMIN_URL || "*";

function withCors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS",
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  res.headers.set("Access-Control-Allow-Credentials", "true");
  return res;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* ================= API CORS HANDLING ================= */
  // Handle preflight requests FIRST
  if (req.method === "OPTIONS" && pathname.startsWith("/api")) {
    return withCors(new NextResponse(null, { status: 204 }));
  }

  // For all API routes, just pass through with CORS headers
  if (pathname.startsWith("/api")) {
    return withCors(NextResponse.next());
  }

  /* ================= AUTHENTICATION ================= */
  // Ignore static & internal routes
  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const isAuthPage = AUTH_PAGES.includes(pathname);

  // 1️⃣ Logged-in user → auth pages → redirect home
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 2️⃣ Not logged-in user → protected page → login
  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // 3️⃣ Permission-based route protection
  if (token?.role) {
    const role = token.role as {
      isSuperAdmin: boolean;
      permissions: string[];
    };

    // Super admin bypass
    if (role.isSuperAdmin) {
      return NextResponse.next();
    }

    // Check mapped permission routes
    for (const route of PERMISSION_ROUTES) {
      if (route.path.test(pathname)) {
        const hasPermission = role.permissions.includes(route.permission);

        if (!hasPermission) {
          return NextResponse.redirect(new URL("/403", req.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
