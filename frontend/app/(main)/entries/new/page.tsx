"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/Toast";

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const fieldClass =
  "w-full max-w-[40rem] mx-auto block rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-accent/45 focus:border-accent";

const textareaClass =
  "w-full max-w-[40rem] mx-auto block min-h-[12rem] rounded-lg border border-border bg-surface px-4 py-3 text-base leading-relaxed text-ink placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-accent/45 focus:border-accent resize-y";

export default function NewEntryPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(todayString);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    const { error: insertError } = await supabase.from("entries").insert({
      user_id: user.id,
      title: title.trim(),
      content: content.trim(),
      date,
    });

    setLoading(false);

    if (insertError) {
      showToast(insertError.message, "error");
      return;
    }

    showToast("일기가 저장되었습니다.");
    router.push("/entries");
    router.refresh();
  }

  return (
    <div className="max-w-[40rem] mx-auto w-full">
      <Link
        href="/entries"
        className="inline-flex items-center gap-1 text-sm text-subtle hover:text-muted mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        목록으로
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight text-ink mb-6">새 일기</h1>

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
            placeholder="오늘의 제목"
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
            placeholder="오늘 하루를 기록하세요..."
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
            {loading ? "저장 중..." : "저장"}
          </button>
          <Link
            href="/entries"
            className="rounded-lg border border-border bg-surface px-6 py-2.5 text-sm font-medium text-muted hover:bg-surface-muted transition-colors"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
