"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, X } from "lucide-react";

import { FileInput, Input } from "@/components/form";

import { uploadMedia } from "@/lib/uploadMedia";
import type { Media, TempMediaFolder } from "@/lib/types";

type ProductMediaManagerProps = {
  label: string;
  media: Media[];
  type: "image" | "video";
  uploadFolder: TempMediaFolder;
  onChange: (media: Media[]) => void;
  uploading?: boolean;
  setUploading?: React.Dispatch<
    React.SetStateAction<{
      cover: boolean;
      images: boolean;
      videos: boolean;
    }>
  >;
};

export default function ProductMediaManager({
  label,
  media,
  type,
  uploadFolder,
  onChange,
  uploading,
  setUploading,
}: ProductMediaManagerProps) {
  const [open, setOpen] = useState(false);

  async function handleAdd(files: FileList | File[]) {
    if (!setUploading) return;

    const key = type === "image" ? "images" : "videos";

    try {
      setUploading((u) => ({ ...u, [key]: true }));

      const uploaded = await Promise.all(
        Array.from(files).map((file) => uploadMedia(file, uploadFolder))
      );

      onChange([...media, ...uploaded]);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading((u) => ({ ...u, [key]: false }));
    }
  }

  function updateItem(index: number, patch: Partial<Media>) {
    onChange(media.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  }

  function removeItem(index: number) {
    onChange(media.filter((_, i) => i !== index));
  }

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
        <div className="space-y-4">
          <FileInput
            accept={type === "image" ? "image/*" : "video/*"}
            multiple
            disabled={uploading}
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length) {
                handleAdd(files);
              }
            }}
          />
          {uploading && (
            <p className="text-sm text-gray-500">
              Uploading {type === "image" ? "images" : "videos"}...
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {media.map((item, index) => (
              <div
                key={item.publicId}
                className="grid grid-cols-[120px_1fr_auto] gap-4 items-start border border-gray-300 dark:border-gray-700 rounded p-3"
              >
                {/* Preview */}
                {type === "image" ? (
                  <Image
                    src={item.url}
                    alt={item.alt ?? ""}
                    width={120}
                    height={120}
                    loading="lazy"
                    className="rounded object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    controls
                    className="w-[120px] rounded"
                  />
                )}

                {/* Metadata */}

                <div className="space-y-3">
                  <Input
                    placeholder="Alt text"
                    value={item.alt ?? ""}
                    onChange={(e) => updateItem(index, { alt: e.target.value })}
                  />
                  <Input
                    placeholder="Caption (optional)"
                    value={item.caption ?? ""}
                    onChange={(e) =>
                      updateItem(index, { caption: e.target.value })
                    }
                  />
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
