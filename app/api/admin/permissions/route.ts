import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import {
  createPermission,
  listPermissions,
} from "@/server/permission/permission.service";
import { CreatePermissionSchema } from "@/server/permission/permission.validation";
import { generateCrudPermissions } from "@/server/permission/permission.generator";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(req: Request) {
  try {
    await requirePermission("permission:create");

    const body = await req.json();
    const { key, description } = body;

    if (!key || typeof key !== "string") {
      return NextResponse.json({ error: "key is required" }, { status: 400 });
    }

    /**
     * CASE 1:
     * key = "user"
     * → generate user:create, user:read, user:update, user:delete
     */
    if (!key.includes(":")) {
      await generateCrudPermissions(key, description);

      return NextResponse.json(
        { success: true, generated: true, resource: key },
        { status: 201 }
      );
    }

    /**
     * CASE 2:
     * key = "user:create"
     * → create single permission
     */
    const parsed = CreatePermissionSchema.safeParse({
      key,
      description,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const permission = await createPermission(parsed.data);
    return NextResponse.json(permission, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET(req: Request) {
  try {
    await requirePermission(["permission:read", "role:create", "role:update"]);

    const { searchParams } = new URL(req.url);

    const all = searchParams.get("all") === "true";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const search = searchParams.get("search") ?? undefined;
    const sortBy = searchParams.get("sortBy") ?? undefined;
    const sortDir = searchParams.get("sortDir") ?? undefined;

    return NextResponse.json(
      await listPermissions({ page, limit, search, all, sortBy, sortDir })
    );
  } catch (err) {
    return handleApiError(err);
  }
}
