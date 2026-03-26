export function mapPermission(permission: any) {
  return {
    id: String(permission._id),
    key: permission.key,
    description: permission.description,
    createdAt: permission.createdAt,
    updatedAt: permission.updatedAt,
  };
}
