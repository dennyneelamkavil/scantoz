import "server-only";
import { Schema, model, models, Types } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
    },

    phone: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    userType: {
      type: String,
      enum: ["admin", "customer"],
      required: true,
    },

    companyId: {
      type: Types.ObjectId,
      ref: "Company",
    },

    isOwner: {
      type: Boolean,
      default: false,
    },

    roleId: {
      type: Types.ObjectId,
      ref: "Role",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

UserSchema.index({ username: 1, isActive: 1 });

export const UserModel = models.User || model("User", UserSchema);
