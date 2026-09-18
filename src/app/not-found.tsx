import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-deep)]">404</p>
      <h1 className="mt-3 font-serif text-4xl">This drape has left the loom.</h1>
      <p className="mt-4 text-[var(--muted)]">The page is missing. The atelier is still open.</p>
      <Link href="/shop" className="mt-8 inline-flex min-h-12 items-center bg-[var(--maroon)] px-6 text-[var(--ivory)]">
        Shop sarees
      </Link>
    </div>
  );
}
