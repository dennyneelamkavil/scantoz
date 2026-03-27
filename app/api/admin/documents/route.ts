import { NextResponse } from "next/server";

import {
  createDocument,
  listDocuments,
} from "@/server/document/document.service";

import { CreateDocumentSchema } from "@/server/document/document.validation";

import { requirePermission } from "@/server/auth/rbac";
import { auth } from "@/server/auth/session";

import { handleApiError } from "@/server/errors/handleApiError";

/* ================= CREATE ================= */
export async function POST(req: Request) {
  try {
    await requirePermission("document:create");

    const session = await auth();

    if (session?.user?.userType !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = CreateDocumentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const doc = await createDocument(parsed.data);

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

/* ================= LIST ================= */
export async function GET(req: Request) {
  try {
    await requirePermission("document:read");

    const session = await auth();

    if (session?.user?.userType !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const search = searchParams.get("search") ?? undefined;
    const type = searchParams.get("type") ?? undefined;

    const result = await listDocuments({
      page,
      limit,
      search,
      type,
    });

    return NextResponse.json(result);
  } catch (err) {
    return handleApiError(err);
  }
}
