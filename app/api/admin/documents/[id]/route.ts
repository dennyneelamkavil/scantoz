import { NextRequest, NextResponse } from "next/server";

import {
  getDocumentById,
  deleteDocument,
} from "@/server/document/document.service";

import { requirePermission } from "@/server/auth/rbac";
import { auth } from "@/server/auth/session";

import { handleApiError } from "@/server/errors/handleApiError";

/* ================= GET ================= */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await requirePermission("document:read");

    const session = await auth();

    if (session?.user?.userType !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await getDocumentById(id);

    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}

/* ================= DELETE ================= */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await requirePermission("document:delete");

    const session = await auth();

    if (session?.user?.userType !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await deleteDocument(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
