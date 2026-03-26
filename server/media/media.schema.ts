import "server-only";
import { Schema } from "mongoose";

export const MediaSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    alt: {
      type: String,
      trim: true,
      maxlength: 125,
    },
    caption: {
      type: String,
      trim: true,
      maxlength: 300,
    },
  },
  { _id: false }
);
