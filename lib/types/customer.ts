/**
 * Customer address
 */
export interface CustomerAddress {
  id?: string;

  name: string;
  phone: string;

  addressLine1: string;
  addressLine2?: string;

  city: string;
  state: string;
  pincode: string;
  country?: string;

  isDefault?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

/**
 * Lightweight customer reference
 * Used for lists/selectors
 */
export interface CustomerBase {
  id: string;
  phone: string;
}

/**
 * Full Customer model
 * Represents populated API response
 */
export interface Customer extends CustomerBase {
  email?: string;
  fullName?: string;

  wishlist?: string[];

  addresses?: CustomerAddress[];

  isActive: boolean;

  lastLoginAt?: string;

  createdAt: string;
  updatedAt: string;
}
