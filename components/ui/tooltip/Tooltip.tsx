"use client";

import { ReactNode } from "react";

type TooltipProps = {
  content: string;
  children: ReactNode;
  disabled?: boolean;
};

export default function Tooltip({ content, children, disabled }: TooltipProps) {
  return (
    <div className="relative group inline-flex">
      {children}

      {!disabled && (
        <span
          role="tooltip"
          className="
          pointer-events-none
          absolute bottom-full left-1/2 mb-2 -translate-x-1/2
          whitespace-nowrap
          rounded-md bg-gray-900 px-2 py-1 text-xs text-white
          opacity-0 transition-opacity
          group-hover:opacity-100
          dark:bg-gray-700
        "
        >
          {content}
        </span>
      )}
    </div>
  );
}
