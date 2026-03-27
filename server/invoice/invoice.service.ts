import "server-only";

import { connectDB } from "@/server/db";
import { auth } from "@/server/auth/session";

import { InvoiceModel } from "@/server/models/invoice.model";
import { DocumentModel } from "@/server/models/document.model";

import { uploadToCloudinary } from "@/server/media/media.provider";

import { mapInvoice } from "./invoice.mapper";
import type {
  CreateInvoiceInput,
  UpdateInvoiceInput,
} from "./invoice.validation";

import { AppError } from "@/server/errors/AppError";

/* ================= CREATE INVOICE ================= */
export async function createInvoice(
  fileBuffer: Buffer,
  input: CreateInvoiceInput,
) {
  await connectDB();

  const session = await auth();
  if (!session?.user) {
    throw new AppError("Unauthorized", 401);
  }

  const { user } = session;

  // 🔥 Validate document
  const document = await DocumentModel.findById(input.documentId);
  if (!document || document.isDeleted) {
    throw new AppError("Document not found", 404);
  }

  // 🔥 Company check
  if (
    user.userType === "customer" &&
    String(document.companyId) !== user.companyId
  ) {
    throw new AppError("Forbidden", 403);
  }

  // ☁️ Upload file
  const media = await uploadToCloudinary(fileBuffer, {
    folder: "invoices",
  });

  const invoice = await InvoiceModel.create({
    companyId: document.companyId,
    documentId: document._id,

    uploadedBy: user.id,

    file: media,

    invoiceNumber: input.invoiceNumber,
    invoiceDate: input.invoiceDate ? new Date(input.invoiceDate) : undefined,

    vendorName: input.vendorName,

    grossAmount: input.grossAmount,
    taxAmount: input.taxAmount,
    totalAmount: input.totalAmount,

    currency: input.currency || "INR",

    status: "uploaded",
  });

  // 🔥 update document count
  await DocumentModel.findByIdAndUpdate(document._id, {
    $inc: { totalInvoices: 1 },
  });

  return mapInvoice(invoice);
}

/* ================= LIST ================= */
export async function listInvoices(documentId: string) {
  await connectDB();

  const session = await auth();
  if (!session?.user) {
    throw new AppError("Unauthorized", 401);
  }

  const { user } = session;

  const query: any = {
    documentId,
    isDeleted: false,
  };

  if (user.userType === "customer") {
    query.companyId = user.companyId;
  }

  const invoices = await InvoiceModel.find(query)
    .sort({ createdAt: -1 })
    .lean();

  return invoices.map(mapInvoice);
}

/* ================= UPDATE ================= */
export async function updateInvoice(id: string, input: UpdateInvoiceInput) {
  await connectDB();

  const session = await auth();
  if (!session?.user) {
    throw new AppError("Unauthorized", 401);
  }

  const invoice = await InvoiceModel.findById(id);
  if (!invoice) {
    throw new AppError("Invoice not found", 404);
  }

  const update: any = { ...input };

  if (input.invoiceDate) {
    update.invoiceDate = new Date(input.invoiceDate);
  }

  const updated = await InvoiceModel.findByIdAndUpdate(id, update, {
    new: true,
  });

  return mapInvoice(updated);
}

/* ================= DELETE ================= */
export async function deleteInvoice(id: string) {
  await connectDB();

  const session = await auth();
  if (!session?.user) {
    throw new AppError("Unauthorized", 401);
  }

  const invoice = await InvoiceModel.findById(id);
  if (!invoice) {
    throw new AppError("Invoice not found", 404);
  }

  invoice.isDeleted = true;
  await invoice.save();

  // 🔥 reduce document count
  await DocumentModel.findByIdAndUpdate(invoice.documentId, {
    $inc: { totalInvoices: -1 },
  });

  return { success: true };
}
