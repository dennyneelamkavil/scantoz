import "server-only";

import bcrypt from "bcryptjs";

import { auth } from "@/server/auth/session";

import { connectDB } from "@/server/db";
import { UserModel } from "@/server/models/user.model";
import "@/server/models/role.model";
import "@/server/models/permission.model";

import { mapUser } from "@/server/user/user.mapper";
import type {
  CreateUserInput,
  UpdateUserInput,
} from "@/server/user/user.validation";

import { buildSortSpec } from "@/server/utils/build-sort-spec";
import { AppError } from "@/server/errors/AppError";

/* ================= VERIFY ================= */
export async function verifyUser(username: string, password: string) {
  await connectDB();

  const user = await UserModel.findOne({
    username,
    isActive: true,
    isDeleted: false,
  }).populate({
    path: "roleId",
    populate: { path: "permissions" },
  });

  if (!user) return null;

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;

  let role = null;

  // 🔥 Only admins have roles
  if (user.userType === "admin" && user.roleId) {
    const r: any = user.roleId;

    role = {
      id: String(r._id),
      name: r.name,
      isSuperAdmin: r.isSuperAdmin,
      permissions: r.permissions.map((p: any) => p.key),
    };
  }

  return {
    id: String(user._id),
    username: user.username,
    name: user.name,
    userType: user.userType,
    companyId: user.companyId ? String(user.companyId) : null,
    role,
  };
}

/* ================= CREATE ================= */
export async function createUser(input: CreateUserInput) {
  await connectDB();

  const exists = await UserModel.findOne({ username: input.username }).lean();
  if (exists) {
    throw new AppError("Username already taken", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await UserModel.create({
    username: input.username,
    password: passwordHash,
    name: input.name,
    email: input.email,
    phone: input.phone,

    userType: input.userType,

    companyId: input.companyId,
    isOwner: input.isOwner ?? false,

    roleId: input.roleId || null,

    isActive: input.isActive ?? true,
  });

  return mapUser(user);
}

/* ================= LIST ================= */
export async function listUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  all?: boolean;
  sortBy?: string;
  sortDir?: string;
  roleId?: string;
  isActive?: string;
  userType?: string;
}) {
  await connectDB();

  const query: any = {
    isDeleted: false,
  };

  if (params.userType) {
    query.userType = params.userType;
  }

  if (params.search) {
    query.$or = [
      { username: { $regex: params.search, $options: "i" } },
      { name: { $regex: params.search, $options: "i" } },
      { email: { $regex: params.search, $options: "i" } },
    ];
  }

  if (params.roleId) {
    query.roleId = params.roleId;
  }

  if (params.isActive === "true") query.isActive = true;
  if (params.isActive === "false") query.isActive = false;

  if (params.all) {
    const users = await UserModel.find(query)
      .populate({
        path: "roleId",
        populate: { path: "permissions" },
      })
      .sort({ createdAt: -1 })
      .lean();

    return {
      data: users.map(mapUser),
      pagination: null,
    };
  }

  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(50, params.limit ?? 10);
  const skip = (page - 1) * limit;

  const { sortSpec, sortBy, sortDir } = buildSortSpec({
    type: "user",
    sortBy: params.sortBy,
    sortDir: params.sortDir,
    defaultSortBy: "createdAt",
    defaultSortDir: "desc",
  });

  const [users, total] = await Promise.all([
    UserModel.find(query)
      .populate({
        path: "roleId",
        populate: { path: "permissions" },
      })
      .sort(sortSpec)
      .skip(skip)
      .limit(limit)
      .lean(),

    UserModel.countDocuments(query),
  ]);

  return {
    data: users.map(mapUser),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    sort: {
      by: sortBy,
      dir: sortDir,
    },
  };
}

/* ================= GET ================= */
export async function getUserById(id: string) {
  await connectDB();

  const user = await UserModel.findById(id)
    .populate({
      path: "roleId",
      populate: { path: "permissions" },
    })
    .lean();

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return mapUser(user);
}

/* ================= UPDATE ================= */
export async function updateUser(id: string, input: UpdateUserInput) {
  await connectDB();

  const session = await auth();
  const currentUserId = session?.user?.id;

  if (!currentUserId) {
    throw new AppError("Unauthorized", 401);
  }

  const existing = await UserModel.findById(id).lean();
  if (!existing) {
    throw new AppError("User not found", 404);
  }

  const update: any = { ...input };

  if (input.password) {
    update.password = await bcrypt.hash(input.password, 12);
  }

  const user = await UserModel.findByIdAndUpdate(id, update, {
    new: true,
  }).populate({
    path: "roleId",
    populate: { path: "permissions" },
  });

  return mapUser(user);
}

/* ================= DELETE ================= */
export async function deleteUser(id: string) {
  await connectDB();

  const session = await auth();
  const currentUserId = session?.user?.id;

  if (!currentUserId) {
    throw new AppError("Unauthorized", 401);
  }

  if (id === currentUserId) {
    throw new AppError("You cannot delete your own account", 403);
  }

  const user = await UserModel.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  await UserModel.findByIdAndUpdate(id, { isDeleted: true });

  return { success: true };
}
