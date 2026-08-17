import Link from "next/link";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/settings", label: "Brand & pages" },
  { href: "/admin/products", label: "Catalog" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/banners", label: "Home banners" },
  { href: "/admin/journal", label: "Journal" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/orders", label: "Orders" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="border-b border-[var(--line)] bg-[var(--ivory-2)]" aria-label="Atelier desk">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-5 gap-y-2 px-4 py-3 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-[var(--forest)] underline-offset-4 hover:underline">
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
      {children}
    </>
  );
}
