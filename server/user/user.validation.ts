import "server-only";
import { z } from "zod";

const emailField = z
  .email()
  .trim()
  .or(z.literal(""))
  .transform((v) => (v === "" ? null : v));

export const CreateUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  fullname: z.string(),
  email: emailField.optional(),
  phone: z.string().optional(),
  role: z.string(),
  isActive: z.boolean().optional(),
});

export const UpdateUserSchema = z.object({
  fullname: z.string().optional(),
  email: emailField.optional(),
  phone: z.string().optional(),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(6).optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
