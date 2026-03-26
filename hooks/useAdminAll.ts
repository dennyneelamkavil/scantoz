"use client";

import { useCallback, useEffect, useState } from "react";

type UseAdminAllOptions = {
  endpoint: string;
  enabled?: boolean;
};

export function useAdminAll<T>({
  endpoint,
  enabled = true,
}: UseAdminAllOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/admin/${endpoint}?all=true`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const json = await res.json();

      setData(json.data);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (enabled) fetchAll();
  }, [fetchAll, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchAll,
  };
}
