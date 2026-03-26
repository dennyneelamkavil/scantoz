"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  FormHeader,
  FormField,
  FormError,
  FormActions,
  Input,
  Checkbox,
  Switch,
} from "@/components/form";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

import { useFieldErrors, useScrollToTop } from "@/hooks";

import type { PermissionBase } from "@/lib/types";

type Fields = "name";

type Props = {
  mode: "create" | "edit";
  id?: string;
};

export default function RoleFormClient({ mode, id }: Props) {
  const { data: session } = useSession();
  const currentUserRoleId = session?.user?.role?.id;
  const router = useRouter();

  const [name, setName] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [permissions, setPermissions] = useState<PermissionBase[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const { fieldErrors, setFieldError, clearFieldError, clearAllFieldErrors } =
    useFieldErrors<Fields>();

  useScrollToTop(error || fieldErrors);

  async function fetchPermissions() {
    const res = await fetch("/api/admin/permissions?all=true", {
      cache: "no-store",
    });
    const json = await res.json();
    setPermissions(json.data);
  }

  const fetchRole = useCallback(async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/admin/roles/${id}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to load role");

      const data = await res.json();
      setName(data.name);
      setIsSuperAdmin(data.isSuperAdmin);
      setSelected(data.permissions.map((p: any) => p.id));
    } catch (err: any) {
      setEditError(err.message ?? "Failed to load role");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPermissions();
    if (mode === "edit") fetchRole();
  }, [mode, fetchRole]);

  const ACTIONS = ["read", "create", "update", "delete"] as const;

  const groupedPermissions = permissions.reduce(
    (acc, perm) => {
      const [module, action] = perm.key.split(":");

      if (!ACTIONS.includes(action as any)) return acc;

      if (!acc[module]) acc[module] = {};
      acc[module][action] = perm;

      return acc;
    },
    {} as Record<string, Record<string, PermissionBase>>,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    clearAllFieldErrors();

    let hasError = false;

    if (!name) {
      setFieldError("name", "Role name is required");
      hasError = true;
    }

    if (!isSuperAdmin && selected.length === 0) {
      setError("Select at least one permission or enable Super Admin");
      hasError = true;
    }

    if (hasError) {
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(
        mode === "create" ? "/api/admin/roles" : `/api/admin/roles/${id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            isSuperAdmin,
            permissions: isSuperAdmin ? [] : selected,
          }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Save failed");
      }

      router.push(mode === "create" ? "/roles" : `/roles/${id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const hasErrors = Object.values(fieldErrors).some(Boolean) || !!error;

  if (currentUserRoleId && id === currentUserRoleId) {
    return (
      <div className="space-y-6">
        <FormHeader title={mode === "create" ? "Create Role" : "Edit Role"} />
        <div className="rounded-lg border bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <FormError error={"You cannot edit your own role"} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FormHeader title={mode === "create" ? "Create Role" : "Edit Role"} />

      <div className="rounded-lg border bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : editError ? (
          <FormError error={editError} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && <FormError error={error} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Role name" required htmlFor="name">
                <Input
                  id="name"
                  placeholder="admin"
                  value={name}
                  onChange={(e) => {
                    clearFieldError("name");
                    setError(null);
                    setName(e.target.value);
                  }}
                  error={!!fieldErrors.name}
                  hint={fieldErrors.name}
                  autoFocus
                />
              </FormField>

              <FormField label="Super Admin">
                <Checkbox
                  checked={isSuperAdmin}
                  onChange={(checked) => {
                    setIsSuperAdmin(checked);
                    setError(null);
                  }}
                  label="Super Admin (bypass permissions)"
                />
              </FormField>
            </div>

            {!isSuperAdmin && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Permissions
                </label>

                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                  <table className="w-full table-auto">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-5 py-3 text-left text-sm font-medium">
                          Module
                        </th>
                        {ACTIONS.map((action) => (
                          <th
                            key={action}
                            className="px-5 py-3 text-center text-sm font-medium capitalize"
                          >
                            {action}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {Object.entries(groupedPermissions).map(
                        ([module, perms]) => (
                          <tr
                            key={module}
                            className="border-t border-gray-200 dark:border-gray-800"
                          >
                            <td className="px-5 py-4 font-medium capitalize">
                              {module}
                            </td>

                            {ACTIONS.map((action) => {
                              const permission = perms[action];
                              const isChecked =
                                permission && selected.includes(permission.id);

                              return (
                                <td
                                  key={action}
                                  className="px-5 py-4 text-center"
                                >
                                  {permission ? (
                                    <div className="flex justify-center">
                                      <Switch
                                        label=""
                                        defaultChecked={isChecked}
                                        onChange={(checked) => {
                                          setSelected((prev) =>
                                            checked
                                              ? [...prev, permission.id]
                                              : prev.filter(
                                                  (id) => id !== permission.id,
                                                ),
                                          );
                                          setError(null);
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Actions */}
            <FormActions
              primaryLabel={
                saving
                  ? "Saving..."
                  : mode === "create"
                    ? "Create Role"
                    : "Update Role"
              }
              primaryDisabled={saving || hasErrors}
              backLabel="Cancel"
              onBack={() => router.back()}
            />
          </form>
        )}
      </div>
    </div>
  );
}
