import "server-only";
import { Schema, model, models, Types } from "mongoose";

const CompanySchema = new Schema(
  {
    name: { type: String, required: true },

    ownerId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    email: { type: String },
    phone: { type: String },
    address: { type: String },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const CompanyModel = models.Company || model("Company", CompanySchema);
