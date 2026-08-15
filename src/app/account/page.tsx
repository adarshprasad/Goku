import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");
  const orders = await prisma.order.count({ where: { userId: session.user.id } });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl">Account</h1>
      <p className="mt-2 text-[var(--muted)]">{session.user.email}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/account/orders" className="border border-[var(--line)] p-5">
          <h2 className="font-serif text-2xl">Orders</h2>
          <p className="text-sm text-[var(--muted)]">{orders} placed</p>
        </Link>
        <Link href="/wishlist" className="border border-[var(--line)] p-5">
          <h2 className="font-serif text-2xl">Wishlist</h2>
        </Link>
        <Link href="/account/returns" className="border border-[var(--line)] p-5">
          <h2 className="font-serif text-2xl">Returns</h2>
        </Link>
        {session.user.role === "ADMIN" ? (
          <Link href="/admin" className="border border-[var(--line)] p-5">
            <h2 className="font-serif text-2xl">Admin</h2>
          </Link>
        ) : null}
      </div>
      <form
        className="mt-8"
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button className="underline">Sign out</button>
      </form>
    </div>
  );
}
