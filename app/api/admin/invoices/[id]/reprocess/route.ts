import { NextRequest, NextResponse } from "next/server";

import { reprocessInvoiceAI } from "@/server/invoice/invoice.service";

import { requirePermission } from "@/server/auth/rbac";
import { auth } from "@/server/auth/session";

import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await requirePermission("invoice:update");

    const session = await auth();

    if (session?.user?.userType !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const invoice = await reprocessInvoiceAI(id);

    return NextResponse.json(invoice);
  } catch (err) {
    return handleApiError(err);
  }
}
