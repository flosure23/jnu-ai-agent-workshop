"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-accent/45 focus:border-accent";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const origin = window.location.origin;
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="bg-surface rounded-2xl border border-border shadow-sm p-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-ink mb-4">메일을 확인하세요</h1>
        <p className="text-muted leading-relaxed mb-6">
          <span className="font-medium text-ink">{email}</span>으로
          비밀번호 재설정 링크를 보냈습니다.
          <br />
          메일함을 확인해주세요.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
        >
          로그인으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-ink text-center mb-2">비밀번호 찾기</h1>
      <p className="text-sm text-subtle text-center mb-8">
        가입할 때 사용한 이메일을 입력하면 비밀번호 재설정 링크를 보내드립니다.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-muted mb-1">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className={inputClass}
          />
        </div>

        {error && (
          <p className="text-sm text-danger bg-danger-muted rounded-lg px-4 py-2" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "전송 중..." : "재설정 링크 보내기"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-subtle">
        <Link href="/login" className="text-accent hover:text-accent-hover underline-offset-2 hover:underline">
          로그인으로 돌아가기
        </Link>
      </p>
    </div>
  );
}
