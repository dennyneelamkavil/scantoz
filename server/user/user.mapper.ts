export function mapUser(user: any) {
  return {
    id: String(user._id),
    username: user.username,
    fullname: user.fullname,
    email: user.email,
    phone: user.phone,
    isActive: user.isActive,
    role: user.role
      ? {
          id: String(user.role._id),
          name: user.role.name,
          isSuperAdmin: user.role.isSuperAdmin,
        }
      : null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
