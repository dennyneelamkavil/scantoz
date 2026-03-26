type SortType =
  | "category"
  | "subcategory"
  | "product"
  | "user"
  | "permission"
  | "role"
  | "pageseo"
  | "inventory"
  | "seller"
  | "customer"
  | "order";
const SORT_FIELD_MAP: Record<SortType, Set<string>> = {
  user: new Set(["username", "fullname", "isActive", "createdAt"]),
  category: new Set(["name", "isActive", "createdAt"]),
  subcategory: new Set(["name", "isActive", "createdAt"]),
  product: new Set(["name", "isFeatured", "isActive", "createdAt"]),
  permission: new Set(["key", "createdAt"]),
  role: new Set(["name", "isSuperAdmin", "createdAt"]),
  pageseo: new Set(["pageKey", "isActive", "createdAt"]),
  inventory: new Set([
    "sku",
    "stock",
    "price.sellingPrice",
    "isActive",
    "createdAt",
  ]),
  seller: new Set([
    "businessName",
    "email",
    "sellerType",
    "businessType",
    "legalName",
    "status",
    "isActive",
    "lastLoginAt",
    "approvedAt",
    "createdAt",
  ]),
  customer: new Set(["fullName", "isActive", "lastLoginAt", "createdAt"]),
  order: new Set(["orderNumber", "paymentStatus", "orderStatus", "createdAt"]),
};

export function buildSortSpec({
  type,
  sortBy,
  sortDir,
  defaultSortBy = "createdAt",
  defaultSortDir = "desc",
}: {
  type: SortType;
  sortBy?: string;
  sortDir?: string;
  defaultSortBy?: string;
  defaultSortDir?: "asc" | "desc";
}) {
  const allowedFields = SORT_FIELD_MAP[type];

  if (!allowedFields) {
    throw new Error(`Unsupported sort type: ${type}`);
  }

  const field = allowedFields.has(sortBy ?? "") ? sortBy! : defaultSortBy;

  const direction =
    sortDir === "asc" || sortDir === "desc" ? sortDir : defaultSortDir;

  return {
    sortSpec: { [field]: direction === "asc" ? 1 : -1 } as Record<
      string,
      1 | -1
    >,
    sortBy: field,
    sortDir: direction,
  };
}
