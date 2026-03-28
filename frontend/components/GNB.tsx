"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function GNB() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="bg-surface border-b border-border shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/entries"
          className="text-lg font-semibold tracking-tight text-ink shrink-0"
        >
          나만의 일기장
        </Link>

        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/entries/new"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transition-colors"
          >
            새 일기
          </Link>
          {email && (
            <span className="text-sm text-subtle hidden md:inline max-w-[200px] truncate">
              {email}
            </span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-muted hover:bg-surface-muted transition-colors"
          >
            로그아웃
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden p-2 text-muted hover:text-ink"
          aria-label="메뉴 열기"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="sm:hidden border-t border-border bg-surface px-4 py-3 space-y-2">
          <Link
            href="/entries/new"
            onClick={() => setMobileOpen(false)}
            className="block w-full text-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
          >
            새 일기
          </Link>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              void handleLogout();
            }}
            className="block w-full text-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted hover:bg-surface-muted transition-colors"
          >
            로그아웃
          </button>
        </div>
      )}
    </nav>
  );
}
