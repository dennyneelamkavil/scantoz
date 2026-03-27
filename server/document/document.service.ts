import "server-only";

import { connectDB } from "@/server/db";
import { auth } from "@/server/auth/session";

import { DocumentModel } from "@/server/models/document.model";
import { InvoiceModel } from "@/server/models/invoice.model";

import { mapDocument } from "./document.mapper";
import type { CreateDocumentInput } from "./document.validation";

import { AppError } from "@/server/errors/AppError";

/* ================= CREATE DOCUMENT ================= */
export async function createDocument(input: CreateDocumentInput) {
  await connectDB();

  const session = await auth();
  if (!session?.user) {
    throw new AppError("Unauthorized", 401);
  }

  const { user } = session;

  // 🔥 Customer must have companyId
  if (user.userType === "customer" && !user.companyId) {
    throw new AppError("Invalid company", 400);
  }

  const document = await DocumentModel.create({
    title: input.title,
    type: input.type,
    notes: input.notes,

    companyId: user.companyId,
    uploadedBy: user.id,
  });

  return mapDocument(document);
}

/* ================= LIST DOCUMENTS ================= */
export async function listDocuments(params: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}) {
  await connectDB();

  const session = await auth();
  if (!session?.user) {
    throw new AppError("Unauthorized", 401);
  }

  const { user } = session;

  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(50, params.limit ?? 10);
  const skip = (page - 1) * limit;

  const query: any = {
    isDeleted: false,
  };

  // 🔥 company scope
  if (user.userType === "customer") {
    query.companyId = user.companyId;
  }

  if (params.search) {
    query.title = { $regex: params.search, $options: "i" };
  }

  if (params.type) {
    query.type = params.type;
  }

  const [docs, total] = await Promise.all([
    DocumentModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    DocumentModel.countDocuments(query),
  ]);

  return {
    data: docs.map(mapDocument),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/* ================= GET DOCUMENT ================= */
export async function getDocumentById(id: string) {
  await connectDB();

  const session = await auth();
  if (!session?.user) {
    throw new AppError("Unauthorized", 401);
  }

  const { user } = session;

  const document = await DocumentModel.findOne({
    _id: id,
    isDeleted: false,
  }).lean();

  if (!document) {
    throw new AppError("Document not found", 404);
  }

  // 🔥 company check
  if (
    user.userType === "customer" &&
    String(document.companyId) !== user.companyId
  ) {
    throw new AppError("Forbidden", 403);
  }

  const invoices = await InvoiceModel.find({
    documentId: id,
    isDeleted: false,
  }).lean();

  return {
    document: mapDocument(document),
    invoices,
  };
}

/* ================= DELETE ================= */
export async function deleteDocument(id: string) {
  await connectDB();

  const session = await auth();
  if (!session?.user) {
    throw new AppError("Unauthorized", 401);
  }

  const document = await DocumentModel.findById(id);

  if (!document) {
    throw new AppError("Document not found", 404);
  }

  document.isDeleted = true;
  await document.save();

  // 🔥 cascade delete invoices
  await InvoiceModel.updateMany(
    { documentId: id },
    { $set: { isDeleted: true } },
  );

  return { success: true };
}
