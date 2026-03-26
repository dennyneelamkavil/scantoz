"use client";

import { useRouter } from "next/navigation";

import { FormHeader, FormError } from "@/components/form";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

import {
  ViewActions,
  ViewBadge,
  ViewField,
  ViewSection,
} from "@/components/view";

import { useAdminEntity } from "@/hooks";

import type { User } from "@/lib/types";

type Props = {
  id: string;
};

export default function UserViewClient({ id }: Props) {
  const router = useRouter();

  const {
    data: user,
    loading,
    error,
  } = useAdminEntity<User>({
    endpoint: "users",
    id,
  });

  return (
    <div className="space-y-6">
      <FormHeader title="View User" />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : error ? (
          <FormError error={error} />
        ) : !user ? null : (
          <div className="space-y-6">
            <div className="sm:sticky top-30 z-10 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <ViewField label="Username" value={user.username} mono />
                <ViewField label="Full Name" value={user.fullname} />
                <ViewField label="Role" value={user.role?.name} mono />

                <div>
                  <p className="text-sm text-gray-500 mb-2">Status</p>
                  <ViewBadge
                    label={user.isActive ? "Active" : "Inactive"}
                    variant={user.isActive ? "success" : "danger"}
                  />
                </div>
              </div>
            </div>

            <ViewSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ViewField label="Email" value={user.email ?? "—"} mono />
                <ViewField label="Phone" value={user.phone ?? "—"} mono />
              </div>
            </ViewSection>

            <ViewSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ViewField
                  label="Created At"
                  value={new Date(user.createdAt).toLocaleString()}
                  mono
                />
                <ViewField
                  label="Last Updated"
                  value={new Date(user.updatedAt).toLocaleString()}
                  mono
                />
              </div>
            </ViewSection>

            <ViewActions
              primaryLabel="Edit User"
              primaryPermission="user:update"
              onPrimary={() => router.push(`/users/${id}/edit`)}
              onBack={() => router.back()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
