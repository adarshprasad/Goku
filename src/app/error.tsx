"use client";

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-4xl">This page did not load</h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Refresh, or open Sign in as a full page. If you just rebuilt the shop, stop the old Node process first.
      </p>
      {error.digest ? <p className="mt-2 text-xs text-[var(--muted)]">Ref {error.digest}</p> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="min-h-11 border border-[var(--line)] px-4">
          Try again
        </button>
        <a href="/login" className="inline-flex min-h-11 items-center bg-[var(--forest)] px-4 text-[var(--ivory)]">
          Sign in
        </a>
      </div>
    </div>
  );
}
