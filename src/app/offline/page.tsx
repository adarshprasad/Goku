import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-serif text-4xl">You are offline</h1>
      <p className="mt-4 text-[var(--muted)]">Pages you already opened can still be read. Checkout needs a connection.</p>
      <Link href="/" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[var(--clay)] px-6 text-white">
        Try home again
      </Link>
    </div>
  );
}
