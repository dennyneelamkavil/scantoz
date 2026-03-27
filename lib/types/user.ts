import type { RoleBase } from "./role";

export interface UserBase {
  id: string;
  username: string;
  name: string;

  email?: string;
  phone?: string;

  userType: "admin" | "customer";
  companyId?: string | null;

  isActive: boolean;
}

export interface User extends UserBase {
  role?: RoleBase | null;
  createdAt: string;
  updatedAt: string;
}
