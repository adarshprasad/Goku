import Link from "next/link";

export const metadata = { title: "What’s in a hospital kit" };

const pieces = [
  ["Snap jabla", "3", "Front snaps, short sleeves, pre-washed cotton."],
  ["Muslin nappy", "5", "Layered langots for the first days."],
  ["Swaddle", "2", "Breathable wraps for the crib and the ride home."],
  ["Hooded towel", "1", "A small towel for the first bath."],
];

export default function HospitalKitPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-5xl">What’s in a hospital kit</h1>
      <p className="mt-4 text-[var(--muted)]">
        This is the first-day set. Wards can change counts after their account is approved. Mothers can buy the same set as a single pack.
      </p>
      <ul className="mt-8 space-y-4">
        {pieces.map(([name, qty, note]) => (
          <li key={name} className="rounded-3xl bg-[var(--sand)] p-5">
            <p className="font-serif text-2xl">
              {qty} × {name}
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">{note}</p>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/product/first-day-hospital-kit" className="inline-flex min-h-12 items-center rounded-full bg-[var(--clay)] px-5 text-white">
          Buy one set
        </Link>
        <Link href="/hospital" className="inline-flex min-h-12 items-center rounded-full border border-[var(--clay)] px-5">
          Order for a ward
        </Link>
      </div>
    </div>
  );
}
