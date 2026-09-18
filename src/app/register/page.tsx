import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  async function register(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    if (!email || password.length < 8) {
      redirect("/register?error=invalid");
    }
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) redirect("/register?error=exists");
    await prisma.user.create({
      data: {
        email,
        name: name || email.split("@")[0],
        passwordHash: await bcrypt.hash(password, 10),
        role: "CUSTOMER",
      },
    });
    await signIn("credentials", { email, password, redirectTo: "/account" });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-4xl">Create an account</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Save addresses, track orders, and keep a wishlist across devices.</p>
      <form action={register} className="mt-8 space-y-4">
        <input name="name" placeholder="Name" className="min-h-11 w-full border border-[var(--line)] px-3" />
        <input name="email" type="email" required placeholder="Email" className="min-h-11 w-full border border-[var(--line)] px-3" />
        <input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Password (8+ characters)"
          className="min-h-11 w-full border border-[var(--line)] px-3"
        />
        {sp.error === "exists" ? <p className="text-sm text-red-800">That email already has an account.</p> : null}
        {sp.error === "invalid" ? <p className="text-sm text-red-800">Use a valid email and a password of at least 8 characters.</p> : null}
        <button className="min-h-12 w-full bg-[var(--maroon)] text-[var(--ivory)]">Create account</button>
      </form>
      <p className="mt-6 text-sm">
        Already a client?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
