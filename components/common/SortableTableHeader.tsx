"use client";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { SortDirection } from "@/lib/table-sort";

interface SortableTableHeaderProps<K extends string> {
  columnKey: K;
  label: string;
  activeKey: K | null;
  direction: SortDirection;
  onSort: (key: K) => void;
}

export function SortableTableHeader<K extends string>({
  columnKey,
  label,
  activeKey,
  direction,
  onSort,
}: SortableTableHeaderProps<K>) {
  const isActive = activeKey === columnKey;

  const Icon = !isActive
    ? ArrowUpDown
    : direction === "asc"
    ? ArrowUp
    : ArrowDown;

  return (
    <button
      type="button"
      onClick={() => onSort(columnKey)}
      className="flex items-center gap-1 font-medium hover:text-foreground"
    >
      <span className={isActive ? "font-semibold" : ""}>{label}</span>
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
