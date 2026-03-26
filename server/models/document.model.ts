import "server-only";
import { Schema, model, models, Types } from "mongoose";

const DocumentSchema = new Schema(
  {
    companyId: {
      type: Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    uploadedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String },

    type: {
      type: String,
      enum: ["sales", "purchase", "expense", "legal", "other"],
      required: true,
    },

    totalInvoices: {
      type: Number,
      default: 0,
    },

    notes: { type: String },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const DocumentModel =
  models.Document || model("Document", DocumentSchema);
