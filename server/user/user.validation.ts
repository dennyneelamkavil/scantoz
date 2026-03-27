import "server-only";
import { z } from "zod";

const emailField = z
  .string()
  .email()
  .or(z.literal(""))
  .transform((v) => (v === "" ? null : v));

export const CreateUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),

  name: z.string(),

  email: emailField.optional(),
  phone: z.string().optional(),

  userType: z.enum(["admin", "customer"]),

  companyId: z.string().optional(),
  isOwner: z.boolean().optional(),

  roleId: z.string().optional(),

  isActive: z.boolean().optional(),
});

export const UpdateUserSchema = z.object({
  name: z.string().optional(),

  email: emailField.optional(),
  phone: z.string().optional(),

  roleId: z.string().optional(),

  isActive: z.boolean().optional(),

  password: z.string().min(6).optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
