"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import EntryCard from "@/components/EntryCard";
import SearchBar from "@/components/SearchBar";
import { createClient } from "@/lib/supabase/client";
import { ENTRIES_PAGE_SIZE, fetchEntriesPage } from "@/lib/entries-queries";
import type { Entry } from "@/lib/types";

export default function EntriesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const load = useCallback(async () => {
    setLoading(true);
    setListError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setEntries([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    const { rows, total: count, error } = await fetchEntriesPage(
      supabase,
      user.id,
      page,
      debouncedSearch,
    );
    if (error) {
      setListError(error.message);
      setEntries([]);
      setTotal(0);
    } else {
      setEntries(rows as Entry[]);
      setTotal(count);
    }
    setLoading(false);
  }, [page, debouncedSearch]);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / ENTRIES_PAGE_SIZE));

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    setPage(1);
  }, []);

  const showInitialLoading = useMemo(() => loading && entries.length === 0 && !listError, [loading, entries.length, listError]);

  if (showInitialLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface rounded-xl border border-border p-5 animate-pulse"
          >
            <div className="h-5 bg-surface-muted rounded w-1/3 mb-3" />
            <div className="h-4 bg-border rounded w-full mb-2" />
            <div className="h-4 bg-border rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      {listError && (
        <p className="text-sm text-danger bg-danger-muted rounded-lg px-4 py-2 mb-4" role="alert">
          {listError}
        </p>
      )}

      {entries.length === 0 && !loading ? (
        <div className="text-center py-16">
          {debouncedSearch ? (
            <p className="text-muted">검색 결과가 없습니다</p>
          ) : (
            <>
              <p className="text-muted mb-4">첫 일기를 작성해보세요</p>
              <Link
                href="/entries/new"
                className="inline-block rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
              >
                새 일기 쓰기
              </Link>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-muted hover:bg-surface-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                이전
              </button>
              <span className="text-sm text-subtle tabular-nums">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-muted hover:bg-surface-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
