"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 bg-background">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold tracking-tight text-ink mb-2">문제가 발생했습니다</h1>
        <p className="text-muted leading-relaxed mb-6">
          {error.message || "알 수 없는 오류가 발생했습니다."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
