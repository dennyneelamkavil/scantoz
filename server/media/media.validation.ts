import "server-only";
import { z } from "zod";

export const MediaValidation = z.object({
  url: z.url(),
  publicId: z.string(),
  resourceType: z.enum(["image", "video"]),
  alt: z.string().optional(),
  caption: z.string().optional(),
});
