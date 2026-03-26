import "server-only";
import { Schema, model, models } from "mongoose";

const OtpSchema = new Schema(
  {
    destination: {
      type: String,
      required: true,
      index: true, // phone or email
    },
    type: {
      type: String,
      enum: ["phone", "email"],
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    requestCount: {
      type: Number,
      default: 1,
    },
    windowStart: {
      type: Date,
      default: Date.now,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// automatically delete expired otps
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
OtpSchema.index({ destination: 1, type: 1 });

export const OtpModel = models.Otp || model("Otp", OtpSchema);
