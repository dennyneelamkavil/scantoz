import "server-only";
import { z } from "zod";

export const CreateDocumentSchema = z.object({
  title: z.string().optional(),

  type: z.enum(["sales", "purchase", "expense", "legal", "other"]),

  notes: z.string().optional(),
});

export type CreateDocumentInput = z.infer<typeof CreateDocumentSchema>;
