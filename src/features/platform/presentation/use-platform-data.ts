"use client";
import { useCallback, useEffect, useState } from "react";
import type { Page } from "../domain/models";
import { errorMessage } from "../domain/errors";

export function usePlatformData<T>(
  load: (cursor?: string) => Promise<Page<T>>,
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    async function read() {
      const all: T[] = [];
      let cursor: string | undefined;
      const seen = new Set<string>();
      do {
        const page = await load(cursor);
        all.push(...page.items);
        cursor = page.next_cursor ?? undefined;
        if (cursor && seen.has(cursor))
          throw new Error("Repeated pagination cursor");
        if (cursor) seen.add(cursor);
      } while (cursor && active);
      if (active) {
        setItems(all);
        setError(null);
        setLoading(false);
      }
    }
    read().catch((e: unknown) => {
      if (active) {
        setError(errorMessage(e));
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [load, revision]);
  const reload = useCallback(() => {
    setLoading(true);
    setRevision((v) => v + 1);
  }, []);
  return { items, loading, error, reload };
}
