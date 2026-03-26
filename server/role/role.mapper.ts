export function mapRole(role: any) {
  return {
    id: String(role._id),
    name: role.name,
    isSuperAdmin: role.isSuperAdmin,
    permissions:
      role.permissions?.map((p: any) => ({
        id: String(p._id),
        key: p.key,
        description: p.description,
      })) ?? [],
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
}
