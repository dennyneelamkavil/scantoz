"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  FormHeader,
  FormField,
  FormError,
  FormActions,
  Switch,
  Select,
  FormSEOSection,
} from "@/components/form";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

import { useFieldErrors, useScrollToTop } from "@/hooks";

import { uploadMedia } from "@/lib/uploadMedia";
import type { Seo } from "@/lib/types";

type Fields = "pageKey";

type Props = {
  mode: "create" | "edit";
  id?: string;
};

export default function SeoFormClient({ mode, id }: Props) {
  const router = useRouter();

  const [pageKey, setPageKey] = useState("");
  const [seo, setSeo] = useState<Seo>({});

  const [isActive, setIsActive] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const { fieldErrors, setFieldError, clearFieldError, clearAllFieldErrors } =
    useFieldErrors<Fields>();

  useScrollToTop(error || fieldErrors);

  const fetchPageSeo = useCallback(async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/admin/seo/${id}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to load Page SEO");

      const data = await res.json();

      setPageKey(data.pageKey);
      setSeo(data.seo ?? {});
      setIsActive(data.isActive);
    } catch (err: any) {
      setEditError(err.message ?? "Failed to load Page SEO");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (mode === "edit") fetchPageSeo();
  }, [mode, fetchPageSeo]);

  const options = [
    { value: "home", label: "Home" },
    { value: "about", label: "About" },
    { value: "contact", label: "Contact" },
  ];

  async function handleUploadOgImage(file: File) {
    setUploading(true);
    try {
      return await uploadMedia(file, "temp/seo");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    clearAllFieldErrors();

    if (!pageKey) {
      setFieldError("pageKey", "Page key is required");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(
        mode === "create" ? "/api/admin/seo" : `/api/admin/seo/${id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pageKey,
            seo,
            isActive,
          }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Save failed");
      }

      router.push(mode === "create" ? "/seo" : `/seo/${id}`);
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
        title={mode === "create" ? "Create Page SEO" : "Edit Page SEO"}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : editError ? (
          <FormError error={editError} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && <FormError error={error} />}

            <FormField label="Page" required>
              <Select
                options={options}
                value={pageKey}
                placeholder="Select Page"
                onChange={(value) => {
                  clearFieldError("pageKey");
                  setError(null);
                  setPageKey(value);
                }}
                error={!!fieldErrors.pageKey}
                hint={fieldErrors.pageKey}
              />
            </FormField>

            <FormSEOSection
              value={seo}
              onChange={setSeo}
              uploading={uploading}
              onUploadOgImage={handleUploadOgImage}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Page SEO Status">
                <Switch
                  label={isActive ? "Active" : "Inactive"}
                  defaultChecked={isActive}
                  onChange={setIsActive}
                />
              </FormField>
            </div>

            <FormActions
              primaryLabel={
                saving
                  ? "Saving..."
                  : mode === "create"
                    ? "Create Page SEO"
                    : "Update Page SEO"
              }
              primaryDisabled={saving || uploading || hasErrors}
              backLabel="Cancel"
              onBack={() => router.back()}
            />
          </form>
        )}
      </div>
    </div>
  );
}
