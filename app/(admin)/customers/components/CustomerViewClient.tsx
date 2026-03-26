"use client";

import { useRouter } from "next/navigation";

import { FormHeader, FormError } from "@/components/form";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

import {
  ViewActions,
  ViewField,
  ViewSection,
  ViewBadge,
  CollapsibleViewSection,
} from "@/components/view";

import { useAdminEntity } from "@/hooks";
import type { Customer } from "@/lib/types";

type Props = {
  id: string;
};

export default function CustomerViewClient({ id }: Props) {
  const router = useRouter();

  const {
    data: customer,
    loading,
    error,
  } = useAdminEntity<Customer>({
    endpoint: "customers",
    id,
  });

  return (
    <div className="space-y-6">
      <FormHeader title="View Customer" />
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : error ? (
          <FormError error={error} />
        ) : !customer ? null : (
          <div className="space-y-6">
            <ViewSection>
              <div className="sm:sticky top-30 z-10 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <ViewField
                    label="Full Name"
                    value={customer.fullName ?? "-"}
                  />
                  <ViewField label="Phone" value={customer.phone} mono />
                  <ViewField label="Email" value={customer.email ?? "-"} />
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Status</p>
                    <ViewBadge
                      label={customer.isActive ? "Active" : "Inactive"}
                      variant={customer.isActive ? "success" : "danger"}
                    />
                  </div>
                </div>
              </div>
            </ViewSection>

            {customer.addresses && (
              <CollapsibleViewSection title="Addresses" collapsible>
                <div className="space-y-4">
                  {customer.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="rounded-md bg-gray-50 p-4 text-sm"
                    >
                      <p className="font-medium">{addr.name}</p>
                      <p>{addr.phone}</p>
                      <p>{addr.addressLine1}</p>
                      {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                      <p>
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p>{addr.country}</p>
                      {addr.isDefault && (
                        <p className="text-green-600 text-xs mt-1">
                          Default Address
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleViewSection>
            )}

            <ViewSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <ViewField
                  label="Last Login"
                  value={
                    customer?.lastLoginAt
                      ? new Date(customer.lastLoginAt).toLocaleString()
                      : "-"
                  }
                  mono
                />
                <ViewField
                  label="Created At"
                  value={new Date(customer.createdAt).toLocaleString()}
                  mono
                />
                <ViewField
                  label="Last Updated"
                  value={new Date(customer.updatedAt).toLocaleString()}
                  mono
                />
              </div>
            </ViewSection>

            <ViewActions
              primaryLabel="Edit Customer"
              primaryPermission="customer:update"
              onPrimary={() => router.push(`/customers/${id}/edit`)}
              onBack={() => router.back()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
