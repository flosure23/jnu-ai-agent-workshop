"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/Toast";
import type { Entry } from "@/lib/types";

const fieldClass =
  "w-full max-w-[40rem] mx-auto block rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-accent/45 focus:border-accent";

const textareaClass =
  "w-full max-w-[40rem] mx-auto block min-h-[12rem] rounded-lg border border-border bg-surface px-4 py-3 text-base leading-relaxed text-ink placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-accent/45 focus:border-accent resize-y";

export default function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [entry, setEntry] = useState<Entry | null | undefined>(undefined);
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

    const { data, error: qError } = await supabase
      .from("entries")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (qError) {
      setLoadError(qError.message);
      setEntry(null);
      return;
    }

    if (data) {
      const row = data as Entry;
      setEntry(row);
      setTitle(row.title);
      setContent(row.content);
      setDate(row.date);
    } else {
      setEntry(null);
    }
  }, [id]);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      setError("본문을 입력해주세요.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    const { error: upError } = await supabase
      .from("entries")
      .update({
        title: title.trim(),
        content: content.trim(),
        date,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    setLoading(false);

    if (upError) {
      showToast(upError.message, "error");
      return;
    }

    showToast("일기가 수정되었습니다.");
    router.push(`/entries/${id}`);
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
    <div className="max-w-[40rem] mx-auto w-full">
      <Link
        href={`/entries/${id}`}
        className="inline-flex items-center gap-1 text-sm text-subtle hover:text-muted mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        돌아가기
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight text-ink mb-6">일기 수정</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-muted mb-1">
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-muted mb-1">
            날짜
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-muted mb-1">
            본문
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className={textareaClass}
          />
        </div>

        {error && (
          <p className="text-sm text-danger bg-danger-muted rounded-lg px-4 py-2" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "저장 중..." : "수정 완료"}
          </button>
          <Link
            href={`/entries/${id}`}
            className="rounded-lg border border-border bg-surface px-6 py-2.5 text-sm font-medium text-muted hover:bg-surface-muted transition-colors"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
