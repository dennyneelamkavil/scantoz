import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import { createRole, listRoles } from "@/server/role/role.service";
import { CreateRoleSchema } from "@/server/role/role.validation";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(req: Request) {
  try {
    await requirePermission("role:create");

    const body = await req.json();
    const parsed = CreateRoleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const role = await createRole(parsed.data);
    return NextResponse.json(role, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET(req: Request) {
  try {
    await requirePermission([
      "role:read",
      "user:read",
      "user:create",
      "user:update",
    ]);

    const { searchParams } = new URL(req.url);

    const all = searchParams.get("all") === "true";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const search = searchParams.get("search") ?? undefined;
    const sortBy = searchParams.get("sortBy") ?? undefined;
    const sortDir = searchParams.get("sortDir") ?? undefined;

    const roles = await listRoles({
      page,
      limit,
      search,
      all,
      sortBy,
      sortDir,
    });
    return NextResponse.json(roles);
  } catch (err) {
    return handleApiError(err);
  }
}
