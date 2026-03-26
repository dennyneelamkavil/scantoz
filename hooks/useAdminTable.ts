"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  loadSortState,
  saveSortState,
  toggleSort,
  type SortState,
} from "@/lib/table-sort";
import { PaginationMeta } from "@/lib/types";

type ExtraParams =
  | Record<string, string | number | boolean | undefined>
  | (() => Record<string, string | number | boolean | undefined>);

type UseAdminTableOptions<K extends string> = {
  endpoint: string;
  storageKey: string;
  defaultSort: SortState<K>;
  limit?: number;
  initialSearch?: string;
  extraParams?: ExtraParams;
};

export function useAdminTable<T, K extends string>({
  endpoint,
  storageKey,
  defaultSort,
  limit = 10,
  initialSearch = "",
  extraParams,
}: UseAdminTableOptions<K>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // table state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(initialSearch);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  // sort state
  const [sortState, setSortState] = useState<SortState<K>>(() =>
    loadSortState<K>(storageKey, defaultSort)
  );

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("limit", String(limit));

    if (search) params.set("search", search);
    if (sortState.key) {
      params.set("sortBy", sortState.key);
      params.set("sortDir", sortState.direction);
    }

    const extras =
      typeof extraParams === "function" ? extraParams() : extraParams;

    if (extras) {
      Object.entries(extras).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.set(key, String(value));
        }
      });
    }

    return params.toString();
  }, [page, limit, search, sortState, extraParams]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/admin/${endpoint}?${queryString}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const json = await res.json();

      setData(json.data);
      setPagination(json.pagination ?? null);
      if (json.sort) {
        setSortState((prev) => {
          if (prev.key !== json.sort.by || prev.direction !== json.sort.dir) {
            const next = {
              key: json.sort.by,
              direction: json.sort.dir,
            };
            saveSortState(storageKey, next);
            return next;
          }
          return prev;
        });
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [endpoint, queryString, storageKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onSortChange = useCallback(
    (key: K) => {
      setPage(1);
      setSortState((prev) => {
        const next = toggleSort(prev, key);
        saveSortState(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );

  return {
    // data
    data,
    loading,
    error,
    pagination,

    // pagination
    page,
    setPage,

    // search
    search,
    setSearch,

    // sorting
    sortState,
    onSortChange,

    // actions
    refetch: fetchData,
  };
}
