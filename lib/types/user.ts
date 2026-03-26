import type { RoleBase } from "./role";

/**
 * Lightweight user reference
 * Use for lists, selectors, and nested relations
 */
export interface UserBase {
  id: string;
  username: string;
  fullname: string;
  email?: string;
  phone?: string;
  isActive: boolean;
}

/**
 * Full User model
 * Represents populated API response
 */
export interface User extends UserBase {
  role: RoleBase; // populated
  createdAt: string;
  updatedAt: string;
}
