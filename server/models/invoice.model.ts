import "server-only";
import { Schema, model, models, Types } from "mongoose";
import { MediaSchema } from "@/server/media/media.schema";

const InvoiceSchema = new Schema(
  {
    companyId: {
      type: Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    documentId: {
      type: Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },

    uploadedBy: {
      type: Types.ObjectId,
      ref: "User",
    },

    file: {
      type: MediaSchema,
      required: true,
    },

    invoiceNumber: { type: String },
    invoiceDate: { type: Date },

    vendorName: { type: String },

    grossAmount: { type: Number },
    taxAmount: { type: Number },
    totalAmount: { type: Number },

    currency: { type: String, default: "INR" },

    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
        total: Number,
      },
    ],

    aiProcessed: { type: Boolean, default: false },

    aiRawResponse: {
      type: Schema.Types.Mixed,
    },

    rawData: {
      type: Schema.Types.Mixed,
    },

    status: {
      type: String,
      enum: ["uploaded", "pending", "rejected", "approved"],
      default: "uploaded",
    },

    isEdited: { type: Boolean, default: false },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// 🔥 Important Index
InvoiceSchema.index({ companyId: 1, documentId: 1 });

export const InvoiceModel = models.Invoice || model("Invoice", InvoiceSchema);
