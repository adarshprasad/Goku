import Link from "next/link";
import { login } from "./actions";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const callbackUrl = sp.callbackUrl?.startsWith("/") && !sp.callbackUrl.startsWith("//") ? sp.callbackUrl : "/account";

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-4xl">Sign in</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Use the email you were given for this atelier.</p>
      <form action={login} className="mt-8 space-y-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <input name="email" type="email" required autoComplete="email" placeholder="Email" className="min-h-11 w-full border border-[var(--line)] px-3" />
        <input name="password" type="password" required autoComplete="current-password" placeholder="Password" className="min-h-11 w-full border border-[var(--line)] px-3" />
        {sp.error ? <p className="text-sm text-red-800">Those credentials were not accepted.</p> : null}
        <button className="min-h-12 w-full bg-[var(--forest)] text-[var(--ivory)]">Continue</button>
      </form>
      <p className="mt-6 text-sm">
        <Link href="/checkout" className="underline">
          Continue as guest at checkout
        </Link>
      </p>
    </div>
  );
}
