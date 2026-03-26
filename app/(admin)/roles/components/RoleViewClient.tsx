"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { FormHeader, FormError } from "@/components/form";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

import {
  ViewActions,
  ViewBadge,
  ViewField,
  ViewList,
  ViewSection,
} from "@/components/view";

import { useAdminEntity } from "@/hooks";

import type { Role } from "@/lib/types";

type Props = {
  id: string;
};

export default function RoleViewClient({ id }: Props) {
  const { data: session } = useSession();
  const currentUserRoleId = session?.user?.role?.id;
  const router = useRouter();

  const {
    data: role,
    loading,
    error,
  } = useAdminEntity<Role>({
    endpoint: "roles",
    id,
  });

  return (
    <div className="space-y-6">
      <FormHeader title="View Role" />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : error ? (
          <FormError error={error} />
        ) : !role ? null : (
          <div className="space-y-6">
            <div className="sm:sticky top-30 z-10 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ViewField label="Role Name" value={role.name} mono />

                <div>
                  <p className="text-sm text-gray-500 mb-2">Super Admin</p>
                  <ViewBadge
                    label={role.isSuperAdmin ? "Yes" : "No"}
                    variant={role.isSuperAdmin ? "success" : "info"}
                  />
                </div>
              </div>
            </div>

            {role.permissions.length > 0 && (
              <ViewSection>
                <ViewList
                  label="Assigned Permissions"
                  items={role.permissions.map((p) => p.key)}
                />
              </ViewSection>
            )}

            <ViewSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ViewField
                  label="Created At"
                  value={new Date(role.createdAt).toLocaleString()}
                  mono
                />
                <ViewField
                  label="Last Updated"
                  value={new Date(role.updatedAt).toLocaleString()}
                  mono
                />
              </div>
            </ViewSection>

            <ViewActions
              primaryLabel="Edit Role"
              primaryPermission="role:update"
              onPrimary={() => router.push(`/roles/${id}/edit`)}
              primaryDisabled={id === currentUserRoleId}
              onBack={() => router.back()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
