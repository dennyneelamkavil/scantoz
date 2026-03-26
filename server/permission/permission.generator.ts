import "server-only";
import { PermissionModel } from "@/server/models/permission.model";
import { connectDB } from "@/server/db";

const CRUD_ACTIONS = ["create", "read", "update", "delete"] as const;

export async function generateCrudPermissions(
  resource: string,
  descriptionPrefix?: string
) {
  await connectDB();

  const permissions = CRUD_ACTIONS.map((action) => ({
    key: `${resource}:${action}`,
    description: `${descriptionPrefix ?? resource} ${action}`,
  }));

  for (const perm of permissions) {
    await PermissionModel.updateOne(
      { key: perm.key },
      { $setOnInsert: perm },
      { upsert: true }
    );
  }
}
