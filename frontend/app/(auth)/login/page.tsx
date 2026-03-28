"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-accent/45 focus:border-accent";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nextPath = searchParams.get("next") ?? "/entries";
  const urlError = searchParams.get("error");
  const displayError =
    error ||
    (urlError === "auth" ? "인증에 실패했습니다. 다시 시도해주세요." : "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: signError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (signError) {
      setError(signError.message);
      return;
    }

    router.push(nextPath.startsWith("/") ? nextPath : "/entries");
    router.refresh();
  }

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-ink text-center mb-2">
        로그인
      </h1>
      <p className="text-sm text-subtle text-center mb-8">나만의 일기장에 오신 것을 환영합니다</p>

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

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-muted mb-1">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            autoComplete="current-password"
            className={inputClass}
          />
        </div>

        {displayError && (
          <p className="text-sm text-danger bg-danger-muted rounded-lg px-4 py-2" role="alert">
            {displayError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-2 text-sm">
        <Link
          href="/forgot-password"
          className="text-accent hover:text-accent-hover underline-offset-2 hover:underline"
        >
          비밀번호를 잊으셨나요?
        </Link>
        <p className="text-subtle">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="text-accent hover:text-accent-hover font-medium underline-offset-2 hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-surface rounded-2xl border border-border shadow-sm p-8 text-center text-subtle text-sm">
          로딩 중...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
