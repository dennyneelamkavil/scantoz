"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

import MediaPreviewModal from "@/components/ui/media/MediaPreviewModal";

type MediaItem = {
  publicId: string;
  url: string;
  alt?: string;
  caption?: string;
};

type ViewMediaGridProps = {
  label: string;
  items: MediaItem[];
  type: "image" | "video";
};

export default function ViewMediaGrid({
  label,
  items,
  type,
}: ViewMediaGridProps) {
  const [open, setOpen] = useState(items.length <= 3);
  const [preview, setPreview] = useState<string | null>(null);

  if (!items.length) return null;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg text-gray-700 dark:text-gray-400 border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm font-medium dark:border-gray-800 dark:bg-gray-800/40"
      >
        <span>{label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.publicId}
              className="border rounded-lg p-3 space-y-3"
            >
              {/* Preview */}
              {type === "image" ? (
                <button
                  onClick={() => setPreview(item.url)}
                  className="focus:outline-none"
                >
                  <Image
                    src={item.url}
                    alt={item.alt ?? label}
                    width={160}
                    height={160}
                    loading="lazy"
                    className="rounded object-cover hover:opacity-80 transition"
                  />
                </button>
              ) : (
                <video src={item.url} controls className="w-full rounded" />
              )}

              {/* Metadata */}
              {(item.alt || item.caption) && (
                <div className="space-y-1">
                  {item.alt && (
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Alt:</span> {item.alt}
                    </p>
                  )}
                  {item.caption && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Caption:</span>{" "}
                      {item.caption}
                    </p>
                  )}
                </div>
              )}

              {type === "video" && (
                <button
                  onClick={() => setPreview(item.url)}
                  className="rounded border px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  ▶ Preview Video
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <MediaPreviewModal
        isOpen={!!preview}
        onClose={() => setPreview(null)}
        type={type}
        src={preview ?? ""}
      />
    </div>
  );
}
