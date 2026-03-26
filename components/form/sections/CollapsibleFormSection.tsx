"use client";

import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
};

export default function CollapsibleFormSection({
  title,
  description,
  children,
  collapsible = false,
  defaultOpen = false,
  className = "",
}: Props) {
  const [open, setOpen] = useState(!collapsible || defaultOpen);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {collapsible && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-start justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left dark:border-gray-800 dark:bg-gray-800/40"
        >
          <div className="space-y-0.5">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {title}
            </div>

            {description && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {description}
              </div>
            )}
          </div>

          <ChevronDown
            className={`mt-1 h-4 w-4 shrink-0 transition-transform text-gray-500 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {/* Content */}
      {open && <div className="space-y-8">{children}</div>}
    </div>
  );
}
