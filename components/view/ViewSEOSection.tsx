"use client";

import { useState } from "react";

import {
  ViewBadge,
  ViewField,
  ViewImage,
  ViewSection,
} from "@/components/view";

import type { Seo } from "@/lib/types";
import { ChevronDown } from "lucide-react";

type Props = {
  seo?: Seo | null;
  collapsible?: boolean;
  defaultOpen?: boolean;
};

export default function ViewSEOSection({
  seo,
  collapsible = false,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(!collapsible || defaultOpen);

  if (!seo) return null;

  return (
    <ViewSection>
      {collapsible && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mb-4 flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-400"
        >
          <span>SEO</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {open && (
        <div className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {seo.title && <ViewField label="SEO Title" value={seo.title} />}

            {seo.canonical && (
              <ViewField label="Canonical URL" value={seo.canonical} mono />
            )}
          </div>

          {/* Description */}
          {seo.description && (
            <ViewField label="SEO Description" value={seo.description} />
          )}

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {seo.keywords && seo.keywords.length > 0 && (
              <ViewField label="Keywords" value={seo.keywords.join(", ")} />
            )}

            <div>
              <p className="text-sm text-gray-500 mb-2">Indexing</p>
              <ViewBadge
                label={seo.noIndex ? "No Index" : "Indexable"}
                variant={seo.noIndex ? "danger" : "success"}
              />
            </div>
          </div>

          {/* OG Image */}
          {seo.ogImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ViewImage
                label="OG Image"
                src={seo.ogImage.url}
                alt={seo.ogImage.alt ?? "OG Image"}
                caption={seo.ogImage.caption}
                size={160}
              />
            </div>
          )}
        </div>
      )}
    </ViewSection>
  );
}
