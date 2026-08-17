import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { auth } from "@/auth";
import { getCart } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/collections/wedding", label: "Wedding" },
  { href: "/collections/handloom", label: "Handloom" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "Atelier" },
];

export async function SiteHeader() {
  const session = await auth();
  let count = 0;
  try {
    const cart = await getCart();
    count = cart?.items.reduce((s, i) => s + i.quantity, 0) ?? 0;
  } catch {
    count = 0;
  }
  let wish = 0;
  if (session?.user?.id) {
    wish = await prisma.wishlistItem.count({ where: { userId: session.user.id } });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--ivory)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex min-h-11 items-center gap-3">
          <Image
            src={brand.logo}
            alt={brand.name}
            width={56}
            height={56}
            className="h-14 w-14 rounded-sm object-cover"
            priority
          />
          <span>
            <span className="block font-serif text-2xl tracking-tight text-[var(--maroon)]">{brand.name}</span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.18em] text-[var(--gold-deep)]">
              Bengaluru atelier
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm text-[var(--muted)] transition hover:text-[var(--maroon)]"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/shop?q=" className="hidden min-h-11 items-center sm:flex">
            Search
          </Link>
          <Link href="/wishlist" className="min-h-11 min-w-11 inline-flex items-center">
            Wish{wish ? ` (${wish})` : ""}
          </Link>
          <Link href={session ? "/account" : "/login"} className="min-h-11 inline-flex items-center">
            {session ? "Account" : "Sign in"}
          </Link>
          <Link
            href="/cart"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-[var(--maroon)] px-4 text-[var(--ivory)]"
          >
            Bag {count}
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[var(--line)] bg-[#f3eadc] pb-24 md:pb-8">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <Image src={brand.logo} alt={brand.name} width={96} height={96} className="h-24 w-24 rounded-sm object-cover" />
          <p className="mt-3 font-serif text-2xl text-[var(--maroon)]">{brand.name}</p>
          <p className="mt-2 font-serif italic text-[var(--gold-deep)]">{brand.taglineEn}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--gold-deep)]">Visit</p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{brand.address}</p>
          <p className="mt-2 text-sm">{brand.supportEmail}</p>
          <p className="text-sm">{brand.supportPhone}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="text-xs uppercase tracking-widest text-[var(--gold-deep)]">Client care</p>
          <Link href="/support">Shipping & returns</Link>
          <Link href="/account/orders">Track order</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/refund">Refunds</Link>
        </div>
        <div className="text-sm text-[var(--muted)]">
          <p className="text-xs uppercase tracking-widest text-[var(--gold-deep)]">Promise</p>
          <p className="mt-3">Prepaid UPI & cards. GST invoice. {brand.shippingIndia}. COD in eligible pincodes.</p>
          <p className="mt-2">GSTIN {brand.gstin}</p>
        </div>
      </div>
    </footer>
  );
}

export function BottomNav() {
  const items = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/wishlist", label: "Wish" },
    { href: "/account", label: "Account" },
  ];
  return (
    <nav
      className="safe-bottom fixed bottom-0 left-0 right-0 z-40 flex border-t border-[var(--line)] bg-[var(--ivory)] md:hidden"
      aria-label="Mobile"
    >
      {items.map((i) => (
        <Link key={i.href} href={i.href} className="flex min-h-14 flex-1 items-center justify-center text-sm">
          {i.label}
        </Link>
      ))}
    </nav>
  );
}

export function WhatsAppButton() {
  const href = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("Namaskara, I would like help choosing a Tavaru drape.")}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-20 right-4 z-40 inline-flex min-h-12 items-center rounded-full bg-[#128C7E] px-4 text-sm text-white shadow-lg md:bottom-6"
    >
      WhatsApp
    </a>
  );
}
