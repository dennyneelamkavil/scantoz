"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

import {
  FormField,
  Input,
  TextArea,
  Switch,
  FileInput,
} from "@/components/form";

import type { Seo, Media } from "@/lib/types";

type Props = {
  value: Seo;
  onChange: (value: Seo) => void;
  uploading?: boolean;
  onUploadOgImage?: (file: File) => Promise<Media>;
  collapsible?: boolean;
  defaultOpen?: boolean;
};

export default function FormSEOSection({
  value,
  onChange,
  uploading,
  onUploadOgImage,
  collapsible = false,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(!collapsible || defaultOpen);
  const [keywordsDraft, setKeywordsDraft] = useState<string | null>(null);

  const keywordsValue = keywordsDraft ?? value.keywords?.join(", ") ?? "";

  function update<K extends keyof Seo>(key: K, val: Seo[K]) {
    onChange({ ...value, [key]: val });
  }

  function updateOgImage(patch: Partial<Media>) {
    if (!value.ogImage) return;
    update("ogImage", { ...value.ogImage, ...patch });
  }

  return (
    <div className="space-y-6">
      {/* Header (only when collapsible) */}
      {collapsible && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg text-gray-700 dark:text-gray-400 border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm font-medium dark:border-gray-800 dark:bg-gray-800/40"
        >
          <span>Advanced SEO</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {/* Content */}
      {open && (
        <div className="space-y-8">
          {/* Title + Canonical */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="SEO Title">
              <Input
                placeholder="SEO title (max 60–70 characters)"
                value={value.title ?? ""}
                onChange={(e) => update("title", e.target.value)}
              />
            </FormField>

            <FormField label="Canonical URL">
              <Input
                placeholder="https://example.com/page"
                value={value.canonical ?? ""}
                onChange={(e) => update("canonical", e.target.value)}
              />
            </FormField>
          </div>

          {/* Description */}
          <FormField label="SEO Description">
            <TextArea
              rows={3}
              placeholder="Meta description (max 150–160 characters)"
              value={value.description ?? ""}
              onChange={(val) => update("description", val)}
            />
          </FormField>

          {/* Keywords + Indexing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="SEO Keywords">
              <Input
                placeholder="comma,separated,keywords"
                value={keywordsValue}
                onChange={(e) => setKeywordsDraft(e.target.value)}
                onBlur={() => {
                  update(
                    "keywords",
                    keywordsValue
                      .split(",")
                      .map((k) => k.trim())
                      .filter(Boolean),
                  );
                  setKeywordsDraft(null);
                }}
              />
            </FormField>

            <FormField label="Search Engine Indexing">
              <Switch
                label={value.noIndex ? "No Index" : "Indexable"}
                defaultChecked={!!value.noIndex}
                onChange={(checked) => update("noIndex", checked)}
              />
            </FormField>
          </div>

          {/* OG Image */}
          {onUploadOgImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField label="OG Image">
                  <FileInput
                    accept="image/*"
                    disabled={uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const media = await onUploadOgImage(file);
                      update("ogImage", media);
                    }}
                  />
                  {uploading && (
                    <p className="text-sm text-gray-500">Uploading image…</p>
                  )}
                </FormField>

                {value.ogImage && (
                  <Image
                    src={value.ogImage.url}
                    alt={value.ogImage.alt ?? "OG image preview"}
                    width={160}
                    height={84}
                    loading="lazy"
                    className="rounded object-cover border dark:border-gray-800"
                  />
                )}
              </div>

              {value.ogImage && (
                <div className="space-y-4">
                  <FormField label="Image Alt Text">
                    <Input
                      value={value.ogImage.alt ?? ""}
                      onChange={(e) => updateOgImage({ alt: e.target.value })}
                    />
                  </FormField>

                  <FormField label="Image Caption (optional)">
                    <Input
                      value={value.ogImage.caption ?? ""}
                      onChange={(e) =>
                        updateOgImage({ caption: e.target.value })
                      }
                    />
                  </FormField>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
