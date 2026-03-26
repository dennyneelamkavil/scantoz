import "server-only";
import { uploadToCloudinary, deleteFromCloudinary } from "./media.provider";
import { TempMediaFolder } from "@/lib/types";

export async function uploadImage(
  file: Buffer,
  options?: { folder?: TempMediaFolder }
) {
  // Later we can switch provider here (AWS, GCP, etc.)
  return uploadToCloudinary(file, options);
}

export async function deleteImage(
  publicId: string,
  resourceType: "image" | "video" = "image"
) {
  return deleteFromCloudinary(publicId, resourceType);
}
