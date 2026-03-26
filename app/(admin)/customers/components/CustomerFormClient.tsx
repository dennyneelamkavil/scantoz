"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  FormHeader,
  FormField,
  FormError,
  FormActions,
  Input,
  Switch,
  CollapsibleFormSection,
} from "@/components/form";

import FormSkeleton from "@/components/skeletons/FormSkeleton";
import { useFieldErrors, useScrollToTop } from "@/hooks";

type Fields = "phone";

type Props = {
  mode: "create" | "edit";
  id?: string;
};

export default function CustomerFormClient({ mode, id }: Props) {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  const [addresses, setAddresses] = useState<any[]>([]);
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const { fieldErrors, setFieldError, clearFieldError, clearAllFieldErrors } =
    useFieldErrors<Fields>();

  useScrollToTop(error || fieldErrors);

  const fetchCustomer = useCallback(async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/admin/customers/${id}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to load customer");

      const data = await res.json();

      setPhone(data.phone);
      setEmail(data.email ?? "");
      setFullName(data.fullName ?? "");
      setAddresses(data.addresses ?? []);
      setIsActive(data.isActive);
    } catch (err: any) {
      setEditError(err.message ?? "Failed to load customer");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (mode === "edit") fetchCustomer();
  }, [mode, fetchCustomer]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    clearAllFieldErrors();

    if (!phone) {
      setFieldError("phone", "Phone is required");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(
        mode === "create"
          ? "/api/admin/customers"
          : `/api/admin/customers/${id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone,
            email,
            fullName,
            addresses,
            isActive,
          }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Save failed");
      }

      router.push(mode === "create" ? "/customers" : `/customers/${id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <FormHeader
        title={mode === "create" ? "Create Customer" : "Edit Customer"}
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
              <FormField label="Phone" required>
                <Input
                  value={phone}
                  onChange={(e) => {
                    clearFieldError("phone");
                    setError(null);
                    setPhone(e.target.value);
                  }}
                  error={!!fieldErrors.phone}
                  hint={fieldErrors.phone}
                  autoFocus
                />
              </FormField>

              <FormField label="Email">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormField>

              <FormField label="Full Name">
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </FormField>

              <FormField label="Active">
                <Switch
                  label={isActive ? "Active" : "Inactive"}
                  defaultChecked={isActive}
                  onChange={setIsActive}
                />
              </FormField>
            </div>

            <CollapsibleFormSection title="Addresses">
              {addresses.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No addresses added by customer.
                </p>
              ) : (
                <div className="space-y-4">
                  {addresses.map((addr, idx) => (
                    <div
                      key={idx}
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
              )}
            </CollapsibleFormSection>

            <FormActions
              primaryLabel={
                saving
                  ? "Saving..."
                  : mode === "create"
                    ? "Create Customer"
                    : "Update Customer"
              }
              primaryDisabled={saving || !phone || !!error}
              onBack={() => router.back()}
            />
          </form>
        )}
      </div>
    </div>
  );
}
