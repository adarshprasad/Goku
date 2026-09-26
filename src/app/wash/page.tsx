import { brand } from "@/lib/brand";

export const metadata = { title: "Fabric and wash promise" };

export default function WashPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-5xl">Fabric and wash promise</h1>
      <p className="mt-6 leading-relaxed text-[var(--muted)]">
        Baby pieces are cotton or muslin. Before packing we wash them, rinse them clear, and dry them in the shade. They are then sealed. The cloth a newborn touches has already been washed.
      </p>
      <ul className="mt-6 list-disc space-y-2 pl-5 text-[var(--muted)]">
        <li>No stiff finishing left in the fabric.</li>
        <li>Hospital cartons stay sealed until the ward opens a set.</li>
        <li>At home: cold machine wash, shade dry. Nappies can take a hotter wash.</li>
      </ul>
      <p className="mt-6 text-sm">
        Questions: {brand.supportEmail} · {brand.supportPhone}
      </p>
    </div>
  );
}
