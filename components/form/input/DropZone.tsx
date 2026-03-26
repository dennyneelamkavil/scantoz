"use client";

import { useDropzone } from "react-dropzone";

type DropzoneProps = {
  title?: string;
  description?: string;
  onFiles: (files: File[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
};

export default function Dropzone({
  title = "Drag & drop files here",
  description = "browse",
  onFiles,
  accept,
  multiple = false,
  disabled = false,
  error = false,
  hint,
}: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFiles,
    accept,
    multiple,
    disabled,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-xl border border-dashed p-6 text-center transition
          ${
            error
              ? "border-error-500 bg-error-50/30 dark:bg-error-500/10"
              : isDragActive
              ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
              : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
          }
          ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
            📁
          </div>

          <p className="font-medium text-gray-800 dark:text-white/90">
            {title}
          </p>

          <p className="text-sm text-gray-500">
            <span className="text-brand-500 underline">{description}</span>
          </p>
        </div>
      </div>

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error ? "text-error-500" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
