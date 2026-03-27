import "server-only";
import { z } from "zod";

export const CreateInvoiceSchema = z.object({
  documentId: z.string(),

  invoiceNumber: z.string().optional(),
  invoiceDate: z.string().optional(),

  vendorName: z.string().optional(),

  grossAmount: z.number().optional(),
  taxAmount: z.number().optional(),
  totalAmount: z.number().optional(),

  currency: z.string().optional(),
});

export const UpdateInvoiceSchema = z.object({
  invoiceNumber: z.string().optional(),
  invoiceDate: z.string().optional(),

  vendorName: z.string().optional(),

  grossAmount: z.number().optional(),
  taxAmount: z.number().optional(),
  totalAmount: z.number().optional(),

  status: z.enum(["pending", "rejected", "approved"]).optional(),

  isEdited: z.boolean().optional(),
});

export type CreateInvoiceInput = z.infer<typeof CreateInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof UpdateInvoiceSchema>;
