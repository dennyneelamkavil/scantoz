import { NextResponse } from "next/server";

import { createInvoice, listInvoices } from "@/server/invoice/invoice.service";

import { requirePermission } from "@/server/auth/rbac";
import { auth } from "@/server/auth/session";

import { handleApiError } from "@/server/errors/handleApiError";

/* ================= CREATE (UPLOAD + AI) ================= */
export async function POST(req: Request) {
  try {
    await requirePermission("invoice:create");

    const session = await auth();

    if (session?.user?.userType !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();

    const file = formData.get("file") as File;
    const documentId = formData.get("documentId") as string;

    if (!file || !documentId) {
      return NextResponse.json(
        { error: "File and documentId are required" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const invoice = await createInvoice(buffer, { documentId });

    return NextResponse.json(invoice, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

/* ================= LIST ================= */
export async function GET(req: Request) {
  try {
    await requirePermission("invoice:read");

    const session = await auth();

    if (session?.user?.userType !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);

    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return NextResponse.json(
        { error: "documentId is required" },
        { status: 400 },
      );
    }

    const invoices = await listInvoices(documentId);

    return NextResponse.json(invoices);
  } catch (err) {
    return handleApiError(err);
  }
}
