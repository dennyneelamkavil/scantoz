import "server-only";
import { z } from "zod";

export const CreatePermissionSchema = z.object({
  key: z.string().min(3),
  description: z.string().optional(),
});

export const UpdatePermissionSchema = z.object({
  key: z.string().min(3).optional(),
  description: z.string().optional(),
});

export type CreatePermissionInput = z.infer<typeof CreatePermissionSchema>;
export type UpdatePermissionInput = z.infer<typeof UpdatePermissionSchema>;
