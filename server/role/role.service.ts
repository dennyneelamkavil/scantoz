import "server-only";

import { auth } from "@/server/auth/session";

import { connectDB } from "@/server/db";
import { RoleModel } from "@/server/models/role.model";
import { UserModel } from "@/server/models/user.model";
import "@/server/models/permission.model";

import { mapRole } from "@/server/role/role.mapper";
import type {
  CreateRoleInput,
  UpdateRoleInput,
} from "@/server/role/role.validation";

import { buildSortSpec } from "@/server/utils/build-sort-spec";

import { AppError } from "@/server/errors/AppError";

/* ================= CREATE ================= */
export async function createRole(input: CreateRoleInput) {
  await connectDB();

  const exists = await RoleModel.findOne({ name: input.name });
  if (exists) {
    throw new AppError("Role already exists", 409);
  }

  const role = await RoleModel.create({
    name: input.name,
    permissions: input.permissions ?? [],
    isSuperAdmin: input.isSuperAdmin ?? false,
  });

  return mapRole(await role.populate("permissions"));
}

/* ================= LIST ================= */
export async function listRoles(params: {
  page?: number;
  limit?: number;
  search?: string;
  all?: boolean;
  sortBy?: string;
  sortDir?: string;
}) {
  await connectDB();

  if (params?.all) {
    const roles = await RoleModel.find({ name: { $ne: "superadmin" } })
      .populate("permissions")
      .collation({ locale: "en", strength: 2 })
      .sort({ name: 1 })
      .lean();

    return {
      data: roles.map(mapRole),
      pagination: null,
    };
  }

  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(50, params.limit ?? 10);
  const skip = (page - 1) * limit;

  const { sortSpec, sortBy, sortDir } = buildSortSpec({
    type: "role",
    sortBy: params?.sortBy,
    sortDir: params?.sortDir,
    defaultSortBy: "createdAt",
    defaultSortDir: "desc",
  });

  const query: any = {
    name: { $ne: "superadmin" },
  };

  if (params.search) {
    query.name = { $regex: params.search, $options: "i" };
  }

  const [roles, total] = await Promise.all([
    RoleModel.find(query)
      .populate("permissions")
      .collation({ locale: "en", strength: 2 })
      .sort(sortSpec)
      .skip(skip)
      .limit(limit)
      .lean(),
    RoleModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: roles.map(mapRole),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    sort: {
      by: sortBy,
      dir: sortDir,
    },
  };
}

/* ================= GET ================= */
export async function getRoleById(id: string) {
  await connectDB();

  const role = await RoleModel.findById(id).populate("permissions").lean();

  if (!role) {
    throw new AppError("Role not found", 404);
  }
  return mapRole(role);
}

/* ================= UPDATE ================= */
export async function updateRole(id: string, input: UpdateRoleInput) {
  await connectDB();

  const session = await auth();
  const currentUserRoleId = session?.user?.role?.id;
  if (!currentUserRoleId) {
    throw new AppError("Unauthorized", 401);
  }

  // SELF ROLE GUARD
  if (id === currentUserRoleId) {
    throw new AppError(
      "You cannot modify the role currently assigned to you",
      403,
    );
  }

  const existing = await RoleModel.findById(id).select("name").lean();
  if (!existing) {
    throw new AppError("Role not found", 404);
  }

  // SYSTEM ROLE GUARD
  if (existing.name === "superadmin") {
    throw new AppError("System role cannot be modified", 403);
  }

  const role = await RoleModel.findByIdAndUpdate(id, input, {
    new: true,
  }).populate("permissions");

  if (!role) {
    throw new AppError("Role not found", 404);
  }
  return mapRole(role);
}

/* ================= DELETE ================= */
export async function deleteRole(id: string) {
  await connectDB();

  const session = await auth();
  const currentUserRoleId = session?.user?.role?.id;
  if (!currentUserRoleId) {
    throw new AppError("Unauthorized", 401);
  }

  // SELF ROLE GUARD
  if (id === currentUserRoleId) {
    throw new AppError(
      "You cannot delete the role currently assigned to you",
      403,
    );
  }

  const existing = await RoleModel.findById(id).select("name").lean();
  if (!existing) {
    throw new AppError("Role not found", 404);
  }

  // SYSTEM ROLE GUARD
  if (existing.name === "superadmin") {
    throw new AppError("System role cannot be deleted", 403);
  }

  const roleInUse = await UserModel.exists({
    role: id,
  });
  if (roleInUse) {
    throw new AppError(
      "Cannot delete role: one or more users are assigned to this role",
      409,
    );
  }

  const role = await RoleModel.findByIdAndDelete(id);
  if (!role) {
    throw new AppError("Role not found", 404);
  }

  return { success: true };
}
