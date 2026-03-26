"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { EyeCloseIcon, EyeIcon } from "@/icons";

import {
  FormHeader,
  FormField,
  FormError,
  FormActions,
  Input,
  Switch,
  Select,
} from "@/components/form";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

import { useFieldErrors, useScrollToTop } from "@/hooks";

import { isValidEmail } from "@/lib/utils";
import type { RoleBase } from "@/lib/types";

type Fields = "username" | "fullname" | "email" | "password" | "role";

type Props = {
  mode: "create" | "edit";
  id?: string;
};

export default function UserFormClient({ mode, id }: Props) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [role, setRole] = useState("");
  const [roles, setRoles] = useState<RoleBase[]>([]);

  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const { fieldErrors, setFieldError, clearFieldError, clearAllFieldErrors } =
    useFieldErrors<Fields>();

  useScrollToTop(error || fieldErrors);

  async function fetchRoles() {
    const res = await fetch("/api/admin/roles?all=true", {
      cache: "no-store",
    });
    const json = await res.json();
    setRoles(json.data);
  }

  const fetchUser = useCallback(async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to load user");

      const data = await res.json();
      setUsername(data.username);
      setFullname(data.fullname);
      setEmail(data.email ?? "");
      setPhone(data.phone ?? "");
      setRole(data.role?.id ?? "");
      setIsActive(data.isActive);
    } catch (err: any) {
      setEditError(err.message ?? "Failed to load user");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRoles();
    if (mode === "edit") fetchUser();
  }, [mode, fetchUser]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9_]/g, "");

    setUsername(value);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    clearAllFieldErrors();

    let hasError = false;

    if (!username) {
      setFieldError("username", "Username is required");
      hasError = true;
    }

    if (!fullname) {
      setFieldError("fullname", "Full name is required");
      hasError = true;
    }

    if (!role) {
      setFieldError("role", "Role is required");
      hasError = true;
    }

    if (!password && mode === "create") {
      setFieldError("password", "Password is required");
      hasError = true;
    }

    if (email && !isValidEmail(email)) {
      setFieldError("email", "Invalid email address");
      hasError = true;
    }

    if (hasError) {
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(
        mode === "create" ? "/api/admin/users" : `/api/admin/users/${id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            fullname,
            email,
            phone,
            password: password || undefined,
            role,
            isActive,
          }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Save failed");
      }

      router.push(mode === "create" ? "/users" : `/users/${id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const roleOptions = roles.map((r) => ({
    value: r.id,
    label: r.name,
  }));

  const hasErrors = Object.values(fieldErrors).some(Boolean) || !!error;

  return (
    <div className="space-y-6">
      <FormHeader title={mode === "create" ? "Create User" : "Edit User"} />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : editError ? (
          <FormError error={editError} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && <FormError error={error} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Username" required htmlFor="username">
                <Input
                  id="username"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => {
                    clearFieldError("username");
                    setError(null);
                    handleUsernameChange(e);
                  }}
                  error={!!fieldErrors.username}
                  hint={fieldErrors.username}
                  autoFocus
                />
              </FormField>

              <FormField label="Role" required>
                <Select
                  options={roleOptions}
                  value={role}
                  placeholder="Select role"
                  onChange={(value) => {
                    clearFieldError("role");
                    setError(null);
                    setRole(value);
                  }}
                  error={!!fieldErrors.role}
                  hint={fieldErrors.role}
                  disabled={id === currentUserId}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Full Name" required htmlFor="fullname">
                <Input
                  id="fullname"
                  placeholder="John Doe"
                  value={fullname}
                  onChange={(e) => {
                    clearFieldError("fullname");
                    setError(null);
                    setFullname(e.target.value);
                  }}
                  error={!!fieldErrors.fullname}
                  hint={fieldErrors.fullname}
                />
              </FormField>

              <FormField label="Email" htmlFor="email">
                <Input
                  id="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => {
                    clearFieldError("email");
                    setError(null);
                    setEmail(e.target.value);
                  }}
                  error={!!fieldErrors.email}
                  hint={fieldErrors.email}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Phone" htmlFor="phone">
                <Input
                  id="phone"
                  placeholder="9123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FormField>

              <FormField
                label={`Password ${
                  mode === "edit" ? "(leave blank to keep current)" : ""
                }`}
                htmlFor="password"
                required={mode === "create"}
              >
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      clearFieldError("password");
                      setError(null);
                      setPassword(e.target.value);
                    }}
                    error={!!fieldErrors.password}
                    hint={fieldErrors.password}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </button>
                </div>
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Account Status">
                <Switch
                  label={isActive ? "Active" : "Inactive"}
                  defaultChecked={isActive}
                  onChange={setIsActive}
                  disabled={id === currentUserId}
                />
              </FormField>
            </div>

            <FormActions
              primaryLabel={
                saving
                  ? "Saving..."
                  : mode === "create"
                    ? "Create User"
                    : "Update User"
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
