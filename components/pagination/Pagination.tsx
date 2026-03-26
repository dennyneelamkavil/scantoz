"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Tooltip from "../ui/tooltip/Tooltip";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | "...")[] = [];

    const showLeftEllipsis = currentPage > 3;
    const showRightEllipsis = currentPage < totalPages - 2;

    pages.push(1);

    if (showLeftEllipsis) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (showRightEllipsis) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  const baseBtn =
    "h-8 w-8 rounded-lg flex items-center justify-center text-sm font-medium transition";
  const inactiveBtn =
    "text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/[0.05]";
  const activeBtn = "bg-brand-500 text-white hover:bg-brand-600";

  return (
    <div className="flex items-center gap-2">
      <div className="block sm:hidden">
        <Tooltip content="First page" disabled={currentPage === 1}>
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={`${baseBtn} ${inactiveBtn} disabled:opacity-50`}
            aria-label="First page"
          >
            <ChevronsLeft size={16} />
          </button>
        </Tooltip>
      </div>

      <Tooltip content="Previous page" disabled={currentPage === 1}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${baseBtn} ${inactiveBtn} disabled:opacity-50`}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
      </Tooltip>

      {/* Page numbers */}
      <div className="hidden sm:flex items-center gap-1">
        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-sm text-gray-400"
            >
              …
            </span>
          ) : (
            <Tooltip content={`Go to page ${page}`} key={page}>
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`${baseBtn} ${
                  page === currentPage ? activeBtn : inactiveBtn
                }`}
              >
                {page}
              </button>
            </Tooltip>
          )
        )}
      </div>

      <Tooltip content="Next page" disabled={currentPage === totalPages}>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${baseBtn} ${inactiveBtn} disabled:opacity-50`}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </Tooltip>

      <div className="block sm:hidden">
        <Tooltip content="Last page" disabled={currentPage === totalPages}>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`${baseBtn} ${inactiveBtn} disabled:opacity-50`}
            aria-label="Last page"
          >
            <ChevronsRight size={16} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
