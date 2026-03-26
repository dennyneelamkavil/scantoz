"use client";

import { Input } from "@/components/form";
import Button from "@/components/ui/button/Button";

type ListFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  disableClear?: boolean;
  children?: React.ReactNode;
};

export default function ListFilters({
  search,
  onSearchChange,
  onClear,
  disableClear = false,
  children,
}: ListFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      {/* Search */}
      <div className="w-full sm:max-w-xs">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Page-specific filters */}
      {children}

      {/* Clear */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onClear}
        disabled={disableClear}
        className="h-11"
      >
        Clear
      </Button>
    </div>
  );
}
