import React, { FC } from "react";

interface FileInputProps {
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  id?: string;
  error?: boolean;
  hint?: string;
}

const FileInput: FC<FileInputProps> = ({
  className,
  onChange,
  accept,
  multiple = false,
  disabled = false,
  id,
  error = false,
  hint,
}) => {
  return (
    <div>
      <input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={onChange}
        className={`h-11 w-full overflow-hidden rounded-lg border text-sm shadow-theme-xs transition-colors
          ${
            error
              ? "border-error-500 focus:border-error-500 focus:ring-3 focus:ring-error-500/10"
              : "border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10"
          }
          bg-transparent text-gray-500
          file:mr-5 file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r
          file:border-gray-200 file:bg-gray-50 file:py-3 file:px-3.5
          file:text-sm file:text-gray-700
          hover:file:bg-gray-100
          disabled:opacity-60 disabled:cursor-not-allowed
          dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400
          dark:file:border-gray-800 dark:file:bg-white/[0.03]
          ${className}`}
      />

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
};

export default FileInput;
