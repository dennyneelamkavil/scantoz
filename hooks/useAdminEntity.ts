"use client";

import { useEffect, useState } from "react";

type UseAdminEntityOptions<T> = {
  endpoint: string;
  id: string;
};

export function useAdminEntity<T>({ endpoint, id }: UseAdminEntityOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchEntity() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/admin/${endpoint}/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to load data");

        const json = await res.json();
        if (isMounted) setData(json);
      } catch (err: any) {
        if (isMounted) {
          setError(err.message ?? "Failed to load data");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchEntity();

    return () => {
      isMounted = false;
    };
  }, [endpoint, id]);

  return { data, loading, error };
}
