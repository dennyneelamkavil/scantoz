export type SortDirection = "asc" | "desc";

export interface SortState<K extends string = string> {
  key: K | null;
  direction: SortDirection;
}

/**
 * Toggle sort when a header is clicked.
 * - If clicking the same column, flip asc <-> desc
 * - If clicking a new column, start at asc
 */
export const toggleSort = <K extends string>(
  current: SortState<K>,
  key: K
): SortState<K> => {
  if (current.key === key) {
    return {
      key,
      direction: current.direction === "asc" ? "desc" : "asc",
    };
  }

  return { key, direction: "asc" };
};

/**
 * Load a sort state from localStorage with a fallback default.
 */
export const loadSortState = <K extends string>(
  storageKey: string,
  fallback: SortState<K>
): SortState<K> => {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as SortState<K>;
    if (!parsed || !parsed.key || !parsed.direction) return fallback;

    return parsed;
  } catch {
    return fallback;
  }
};

/**
 * Save sort state to localStorage (for table-specific keys).
 */
export const saveSortState = <K extends string>(
  storageKey: string,
  state: SortState<K>
) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(state));
};
