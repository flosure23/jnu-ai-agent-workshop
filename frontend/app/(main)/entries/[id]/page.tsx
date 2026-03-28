"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ConfirmModal from "@/components/ConfirmModal";
import { useToast } from "@/components/Toast";
import type { Entry } from "@/lib/types";

export default function EntryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useToast();
  const [entry, setEntry] = useState<Entry | null | undefined>(undefined);
  const [showDelete, setShowDelete] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setEntry(null);
      return;
    }

    const { data, error } = await supabase
      .from("entries")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      setLoadError(error.message);
      setEntry(null);
      return;
    }

    setEntry(data as Entry | null);
  }, [id]);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  async function handleDelete() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("entries").delete().eq("id", id).eq("user_id", user.id);

    if (error) {
      showToast(error.message, "error");
      return;
    }

    showToast("일기가 삭제되었습니다.");
    router.push("/entries");
    router.refresh();
  }

  if (entry === undefined && !loadError) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-accent" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="text-center py-16 max-w-[40rem] mx-auto">
        <p className="text-danger mb-4">{loadError}</p>
        <Link
          href="/entries"
          className="text-sm text-accent hover:text-accent-hover underline-offset-2 hover:underline"
        >
          목록으로
        </Link>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="text-center py-16 max-w-[40rem] mx-auto">
        <h1 className="text-2xl font-semibold tracking-tight text-ink mb-2">404</h1>
        <p className="text-muted mb-6">일기를 찾을 수 없습니다.</p>
        <Link
          href="/entries"
          className="text-sm text-accent hover:text-accent-hover underline-offset-2 hover:underline"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-[40rem] mx-auto w-full">
      <Link
        href="/entries"
        className="inline-flex items-center gap-1 text-sm text-subtle hover:text-muted mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        목록으로
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink mb-2">{entry.title}</h1>
        <time className="text-sm text-subtle tabular-nums">{entry.date}</time>
      </header>

      <div className="max-w-[40rem] mx-auto w-full mb-10 whitespace-pre-wrap text-base leading-relaxed text-ink/95">
        {entry.content}
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <Link
          href={`/entries/${entry.id}/edit`}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
        >
          수정
        </Link>
        <button
          type="button"
          onClick={() => setShowDelete(true)}
          className="rounded-lg border border-danger-ring px-5 py-2.5 text-sm font-semibold text-danger hover:bg-danger-muted transition-colors"
        >
          삭제
        </button>
      </div>

      <ConfirmModal
        open={showDelete}
        title="일기 삭제"
        message="정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmLabel="삭제"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </article>
  );
}
