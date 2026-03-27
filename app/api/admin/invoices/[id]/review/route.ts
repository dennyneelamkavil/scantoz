import { NextRequest, NextResponse } from "next/server";

import { reviewInvoice } from "@/server/invoice/invoice.service";
import { UpdateInvoiceSchema } from "@/server/invoice/invoice.validation";

import { requirePermission } from "@/server/auth/rbac";
import { auth } from "@/server/auth/session";

import { handleApiError } from "@/server/errors/handleApiError";

export async function PUT(
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

    const body = await req.json();

    const parsed = UpdateInvoiceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const invoice = await reviewInvoice(id, parsed.data);

    return NextResponse.json(invoice);
  } catch (err) {
    return handleApiError(err);
  }
}
