import type { PermissionBase } from "./permission";

/**
 * Lightweight role reference
 * Use for dropdowns, assignments, and nested relations
 */
export interface RoleBase {
  id: string;
  name: string;
  isSuperAdmin: boolean;
}

/**
 * Full Role model
 * Represents populated API response
 */
export interface Role extends RoleBase {
  permissions: PermissionBase[]; // populated
  createdAt: string;
  updatedAt: string;
}

/**
 * Role with permissions as an array of permission keys
 * Useful for authorization checks
 */
export interface RoleWithPermissionKeys extends RoleBase {
  permissions: string[]; // array of permission keys
}
