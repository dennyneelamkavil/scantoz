export function mapUser(user: any) {
  return {
    id: String(user._id),

    username: user.username,
    name: user.name,

    email: user.email,
    phone: user.phone,

    userType: user.userType,
    companyId: user.companyId ? String(user.companyId) : null,

    isActive: user.isActive,

    role: user.roleId
      ? {
          id: String(user.roleId._id),
          name: user.roleId.name,
          isSuperAdmin: user.roleId.isSuperAdmin,
        }
      : null,

    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
