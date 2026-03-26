/**
 * Lightweight permission reference
 * Use for dropdowns, checklists, and nested relations
 */
export interface PermissionBase {
  id: string;
  key: string;
}

/**
 * Full Permission model
 * Represents populated API response
 */
export interface Permission extends PermissionBase {
  description?: string;
  createdAt: string;
  updatedAt: string;
}
