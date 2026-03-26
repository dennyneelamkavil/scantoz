import "server-only";
import { Schema, model, models, Types } from "mongoose";

const LedgerSchema = new Schema(
  {
    companyId: {
      type: Types.ObjectId,
      ref: "Company",
      required: true,
    },

    name: { type: String, required: true },

    description: { type: String },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const LedgerModel = models.Ledger || model("Ledger", LedgerSchema);
