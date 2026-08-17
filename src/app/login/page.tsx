import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const sp = await searchParams;
  async function login(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: String(formData.get("email")),
        password: String(formData.get("password")),
        redirectTo: sp.callbackUrl || "/account",
      });
    } catch (e) {
      if (e instanceof AuthError) {
        redirect("/login?error=CredentialsSignin");
      }
      throw e;
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-4xl">Sign in</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Admin desk: <code>admin@huduku.in</code> / <code>huduku-admin</code> — then open Account → Admin, or{" "}
        <a href="/admin" className="underline">
          /admin
        </a>
        .
        <br />
        Demo customer <code>customer@huduku.in</code> / <code>huduku123</code>
      </p>
      <form action={login} className="mt-8 space-y-4">
        <input name="email" type="email" required placeholder="Email" className="min-h-11 w-full border border-[var(--line)] px-3" />
        <input name="password" type="password" required placeholder="Password" className="min-h-11 w-full border border-[var(--line)] px-3" />
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
