import { NextRequest, NextResponse } from "next/server";

import { deleteInvoice } from "@/server/invoice/invoice.service";

import { requirePermission } from "@/server/auth/rbac";
import { auth } from "@/server/auth/session";

import { handleApiError } from "@/server/errors/handleApiError";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await requirePermission("invoice:delete");

    const session = await auth();

    if (session?.user?.userType !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await deleteInvoice(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
