"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  FormHeader,
  FormField,
  FormError,
  FormActions,
  Input,
  TextArea,
} from "@/components/form";

import FormSkeleton from "@/components/skeletons/FormSkeleton";

import { useFieldErrors, useScrollToTop } from "@/hooks";

type Fields = "key";

type Props = {
  mode: "create" | "edit";
  id?: string;
};

export default function PermissionFormClient({ mode, id }: Props) {
  const router = useRouter();

  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const { fieldErrors, setFieldError, clearFieldError, clearAllFieldErrors } =
    useFieldErrors<Fields>();

  useScrollToTop(error || fieldErrors);

  const fetchPermission = useCallback(async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/admin/permissions/${id}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to load permission");

      const data = await res.json();
      setKey(data.key);
      setDescription(data.description ?? "");
    } catch (err: any) {
      setEditError(err.message ?? "Failed to load permission");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (mode === "edit") fetchPermission();
  }, [mode, fetchPermission]);

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z:]/g, "");

    setKey(value);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    clearAllFieldErrors();

    if (!key) {
      setFieldError("key", "Permission key is required");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(
        mode === "create"
          ? "/api/admin/permissions"
          : `/api/admin/permissions/${id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, description }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Save failed");
      }

      router.push(mode === "create" ? "/permissions" : `/permissions/${id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const hasErrors = Object.values(fieldErrors).some(Boolean) || !!error;

  return (
    <div className="space-y-6">
      <FormHeader
        title={mode === "create" ? "Create Permission" : "Edit Permission"}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : editError ? (
          <FormError error={editError} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && <FormError error={error} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Permission Key" required htmlFor="key">
                <Input
                  id="key"
                  placeholder="user:create"
                  value={key}
                  onChange={(e) => {
                    clearFieldError("key");
                    setError(null);
                    handleKeyChange(e);
                  }}
                  error={!!fieldErrors.key}
                  hint={fieldErrors.key}
                  disabled={mode === "edit"}
                  autoFocus
                />

                {mode === "create" && (
                  <div className="mt-2 rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                    <p className="font-medium">How permission keys work:</p>
                    <ul className="mt-1 list-disc pl-4 space-y-0.5">
                      <li>
                        <code className="font-mono">user</code> → generates{" "}
                        <code className="font-mono">
                          user:create, user:read, user:update, user:delete
                        </code>
                      </li>
                      <li>
                        <code className="font-mono">user:create</code> → creates
                        a single permission
                      </li>
                    </ul>
                  </div>
                )}

                {mode === "edit" && (
                  <p className="mt-1 text-xs text-gray-500">
                    Permission key cannot be changed
                  </p>
                )}
              </FormField>
            </div>

            <FormField label="Description" htmlFor="description">
              <TextArea
                rows={3}
                placeholder="What this permission allows"
                value={description}
                onChange={setDescription}
              />
            </FormField>

            <FormActions
              primaryLabel={
                saving
                  ? "Saving..."
                  : mode === "create"
                    ? "Create Permission"
                    : "Update Permission"
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
