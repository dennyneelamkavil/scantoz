"use client";

import { useRouter } from "next/navigation";

import { FormHeader, FormError } from "@/components/form";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

import { ViewActions, ViewField, ViewSection } from "@/components/view";

import { useAdminEntity } from "@/hooks";

import type { Permission } from "@/lib/types";

type Props = {
  id: string;
};

export default function PermissionViewClient({ id }: Props) {
  const router = useRouter();

  const {
    data: permission,
    loading,
    error,
  } = useAdminEntity<Permission>({
    endpoint: "permissions",
    id,
  });

  return (
    <div className="space-y-6">
      <FormHeader title="View Permission" />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : error ? (
          <FormError error={error} />
        ) : !permission ? null : (
          <div className="space-y-6">
            <div className="sm:sticky top-30 z-10 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
              <div className="grid grid-cols-1 gap-4">
                <ViewField label="Permission Key" value={permission.key} mono />
              </div>
            </div>

            {permission.description && (
              <div className="mt-6">
                <ViewField label="Description" value={permission.description} />
              </div>
            )}

            <ViewSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ViewField
                  label="Created At"
                  value={new Date(permission.createdAt).toLocaleString()}
                  mono
                />
                <ViewField
                  label="Last Updated"
                  value={new Date(permission.updatedAt).toLocaleString()}
                  mono
                />
              </div>
            </ViewSection>

            <ViewActions
              primaryLabel="Edit Permission"
              primaryPermission="permission:update"
              onPrimary={() => router.push(`/permissions/${id}/edit`)}
              onBack={() => router.back()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
