"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-accent/45 focus:border-accent";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionReady(true);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionReady(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await supabase.auth.signOut();
    setDone(true);
  }

  if (done) {
    return (
      <div className="bg-surface rounded-2xl border border-border shadow-sm p-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-ink mb-4">비밀번호 변경 완료</h1>
        <p className="text-muted mb-6">새로운 비밀번호로 로그인해주세요.</p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="inline-block rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
        >
          로그인하기
        </button>
      </div>
    );
  }

  if (!sessionReady) {
    return (
      <div className="bg-surface rounded-2xl border border-border shadow-sm p-8 text-center text-muted text-sm leading-relaxed">
        <p className="mb-4">비밀번호 재설정 링크로 들어온 뒤 이 화면을 사용할 수 있습니다.</p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-accent hover:text-accent-hover underline-offset-2 hover:underline"
        >
          로그인으로
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-ink text-center mb-2">새 비밀번호 설정</h1>
      <p className="text-sm text-subtle text-center mb-8">
        새로운 비밀번호를 입력해주세요.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-muted mb-1">
            새 비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6자 이상"
            autoComplete="new-password"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted mb-1">
            비밀번호 확인
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호 재입력"
            autoComplete="new-password"
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
          {loading ? "변경 중..." : "비밀번호 변경"}
        </button>
      </form>
    </div>
  );
}
