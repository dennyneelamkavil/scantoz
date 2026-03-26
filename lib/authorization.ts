import type { RoleWithPermissionKeys } from "@/lib/types";

export function hasPermission(
  role: RoleWithPermissionKeys | undefined,
  permissions: string | string[]
) {
  if (!role) return false;
  if (role.isSuperAdmin) return true;

  const required = Array.isArray(permissions) ? permissions : [permissions];

  return required.some((p) => role.permissions.includes(p));
}
