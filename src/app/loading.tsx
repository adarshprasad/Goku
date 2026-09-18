export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="h-10 w-48 animate-pulse bg-[var(--ivory-2)]" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse bg-[var(--ivory-2)]" />
        ))}
      </div>
    </div>
  );
}
