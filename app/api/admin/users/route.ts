import { NextResponse } from "next/server";
import { createUser, listUsers } from "@/server/user/user.service";
import { requirePermission } from "@/server/auth/rbac";
import { CreateUserSchema } from "@/server/user/user.validation";
import { handleApiError } from "@/server/errors/handleApiError";
import { auth } from "@/server/auth/session";

export async function POST(req: Request) {
  try {
    await requirePermission("user:create");

    // enforce admin only
    const session = await auth();
    if (session?.user?.userType !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = CreateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const user = await createUser(parsed.data);
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET(req: Request) {
  try {
    await requirePermission("user:read");

    // enforce admin only
    const session = await auth();
    if (session?.user?.userType !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);

    const all = searchParams.get("all") === "true";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const search = searchParams.get("search") ?? undefined;
    const sortBy = searchParams.get("sortBy") ?? undefined;
    const sortDir = searchParams.get("sortDir") ?? undefined;
    const roleId = searchParams.get("roleId") ?? undefined;
    const isActive = searchParams.get("isActive") ?? undefined;
    const userType = searchParams.get("userType") ?? undefined;

    const users = await listUsers({
      page,
      limit,
      search,
      all,
      roleId,
      sortBy,
      sortDir,
      isActive,
      userType,
    });

    return NextResponse.json(users);
  } catch (err) {
    return handleApiError(err);
  }
}
