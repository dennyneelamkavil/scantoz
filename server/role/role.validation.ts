import "server-only";
import { z } from "zod";

export const CreateRoleSchema = z.object({
  name: z.string().min(2),
  permissions: z.array(z.string()).optional(),
  isSuperAdmin: z.boolean().optional(),
});

export const UpdateRoleSchema = z.object({
  name: z.string().min(2).optional(),
  permissions: z.array(z.string()).optional(),
  isSuperAdmin: z.boolean().optional(),
});

export type CreateRoleInput = z.infer<typeof CreateRoleSchema>;
export type UpdateRoleInput = z.infer<typeof UpdateRoleSchema>;
