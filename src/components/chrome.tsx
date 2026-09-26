import Image from "next/image";
import Link from "next/link";
import { getBrand } from "@/lib/brand";
import { formatWhatsAppDisplay, waLink } from "@/lib/utils";
import { socialLinks } from "@/lib/social";
import { auth } from "@/auth";
import { getCart } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

export async function SiteHeader() {
  const [session, brand] = await Promise.all([auth(), getBrand()]);
  const nav = [
    { href: "/shop", label: brand.navShop },
    { href: brand.navWeddingHref, label: brand.navWedding },
    { href: brand.navHandloomHref, label: brand.navHandloom },
    { href: "/journal", label: brand.navJournal },
    { href: "/about", label: brand.navAbout },
  ];
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
  const staff = session?.user?.role === "ADMIN" || session?.user?.role === "STAFF";

  return (
    <header className="sticky top-0 z-40 bg-[var(--forest)] text-[var(--ivory)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex min-h-11 items-center gap-3">
          <Image
            src={brand.logo}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 object-cover"
            priority
          />
          <span>
            <span className="block font-serif text-2xl tracking-tight text-[var(--ivory)]">{brand.name}</span>
            <span className="mt-0.5 hidden text-[10px] tracking-[0.14em] text-[var(--ivory)]/70 sm:block">
              {brand.headerCity}
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm text-[var(--ivory)]/80 transition hover:text-[var(--ivory)]">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          {staff ? (
            <Link
              href="/admin"
              className="inline-flex min-h-11 items-center border border-[var(--ivory)]/50 px-3 text-[var(--ivory)]"
            >
              Admin
            </Link>
          ) : null}
          <Link href="/wishlist" className="min-h-11 min-w-11 inline-flex items-center text-[var(--ivory)]/85">
            Wish{wish ? ` (${wish})` : ""}
          </Link>
          {session ? (
            <Link href="/account" className="min-h-11 inline-flex items-center text-[var(--ivory)]/85">
              Account
            </Link>
          ) : (
            <a href="/login" className="min-h-11 inline-flex items-center text-[var(--ivory)]/85">
              Sign in
            </a>
          )}
          <Link
            href="/cart"
            className="inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--ivory)] px-4 text-[var(--ivory)]"
          >
            Bag {count}
          </Link>
        </div>
      </div>
    </header>
  );
}

export async function SiteFooter() {
  const brand = await getBrand();
  const socials = socialLinks(brand);
  return (
    <footer className="mt-24 bg-[var(--forest)] pb-24 text-[var(--ivory)] md:pb-8">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-4">
        <div>
          <Image src={brand.logo} alt="" width={72} height={72} className="h-[72px] w-[72px] object-cover" />
          <p className="mt-4 font-serif text-2xl">{brand.name}</p>
          <p className="mt-2 font-serif text-base italic text-[var(--ivory)]/75">{brand.taglineEn}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--ivory)]/55">Visit</p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ivory)]/80">{brand.address}</p>
          <p className="mt-2 text-sm">{brand.supportEmail}</p>
          <p className="text-sm">{brand.supportPhone}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-[var(--ivory)]/85">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--ivory)]/55">Client care</p>
          <Link href="/support">Shipping & returns</Link>
          <Link href="/account/orders">Track order</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/refund">Refunds</Link>
        </div>
        <div className="text-sm text-[var(--ivory)]/80">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--ivory)]/55">Follow</p>
          <ul className="mt-3 space-y-2">
            {socials.length === 0 ? <li className="text-[var(--ivory)]/60">Add social URLs in Admin → Brand & pages.</li> : null}
            {socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            {brand.footerPromise} {brand.shippingIndia}.
          </p>
          <p className="mt-2">GSTIN {brand.gstin}</p>
        </div>
      </div>
    </footer>
  );
}

export async function BottomNav() {
  const session = await auth();
  const staff = session?.user?.role === "ADMIN" || session?.user?.role === "STAFF";
  const items = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    ...(staff ? [{ href: "/admin", label: "Admin" }] : [{ href: "/wishlist", label: "Wish" }]),
    { href: session ? "/account" : "/login", label: session ? "Account" : "Sign in" },
  ];
  return (
    <nav
      className="safe-bottom fixed bottom-0 left-0 right-0 z-40 flex border-t border-[var(--line)] bg-[var(--ivory)] md:hidden"
      aria-label="Mobile"
    >
      {items.map((i) => (
        <a key={i.href} href={i.href} className="flex min-h-14 flex-1 items-center justify-center text-sm">
          {i.label}
        </a>
      ))}
    </nav>
  );
}

export async function WhatsAppButton() {
  const brand = await getBrand();
  const href = waLink(`Namaskara, I would like help choosing a ${brand.name} drape.`, brand.whatsapp);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-20 right-4 z-40 inline-flex min-h-12 items-center border border-[var(--forest)] bg-[var(--ivory)] px-4 text-sm text-[var(--forest)] md:bottom-6"
    >
      WhatsApp {formatWhatsAppDisplay(brand.whatsapp)}
    </a>
  );
}
