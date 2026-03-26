import "server-only";

import { connectDB } from "@/server/db";
import { PermissionModel } from "@/server/models/permission.model";
import { RoleModel } from "@/server/models/role.model";

import { mapPermission } from "@/server/permission/permission.mapper";
import type {
  CreatePermissionInput,
  UpdatePermissionInput,
} from "@/server/permission/permission.validation";

import { buildSortSpec } from "@/server/utils/build-sort-spec";

import { AppError } from "@/server/errors/AppError";

/* ================= CREATE ================= */
export async function createPermission(input: CreatePermissionInput) {
  await connectDB();

  const exists = await PermissionModel.findOne({ key: input.key });
  if (exists) {
    throw new AppError("Permission already exists", 409);
  }

  const permission = await PermissionModel.create(input);
  return mapPermission(permission);
}

/* ================= LIST ================= */
export async function listPermissions(params: {
  page?: number;
  limit?: number;
  search?: string;
  all?: boolean;
  sortBy?: string;
  sortDir?: string;
}) {
  await connectDB();

  if (params?.all) {
    const permissions = await PermissionModel.find().sort({ key: 1 }).lean();

    return {
      data: permissions.map(mapPermission),
      pagination: null,
    };
  }

  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(50, params.limit ?? 10);
  const skip = (page - 1) * limit;

  const { sortSpec, sortBy, sortDir } = buildSortSpec({
    type: "permission",
    sortBy: params?.sortBy,
    sortDir: params?.sortDir,
    defaultSortBy: "createdAt",
    defaultSortDir: "desc",
  });

  const query: any = {};

  if (params.search) {
    query.key = { $regex: params.search, $options: "i" };
  }

  const [permissions, total] = await Promise.all([
    PermissionModel.find(query)
      .collation({ locale: "en", strength: 2 })
      .sort(sortSpec)
      .skip(skip)
      .limit(limit)
      .lean(),
    PermissionModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: permissions.map(mapPermission),
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
export async function getPermissionById(id: string) {
  await connectDB();

  const permission = await PermissionModel.findById(id).lean();
  if (!permission) {
    throw new AppError("Permission not found", 404);
  }

  return mapPermission(permission);
}

/* ================= UPDATE ================= */
export async function updatePermission(
  id: string,
  input: UpdatePermissionInput
) {
  await connectDB();

  const permission = await PermissionModel.findByIdAndUpdate(id, input, {
    new: true,
  });

  if (!permission) {
    throw new AppError("Permission not found", 404);
  }
  return mapPermission(permission);
}

/* ================= DELETE ================= */
export async function deletePermission(id: string) {
  await connectDB();

  const usedInRole = await RoleModel.exists({
    permissions: id,
  });
  if (usedInRole) {
    throw new AppError(
      "Cannot delete permission: it is assigned to one or more roles",
      409
    );
  }

  const permission = await PermissionModel.findByIdAndDelete(id);
  if (!permission) {
    throw new AppError("Permission not found", 404);
  }

  return { success: true };
}
