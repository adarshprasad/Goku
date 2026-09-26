"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

function safePath(raw: string) {
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("://")) return "/account";
  return raw;
}

export async function login(formData: FormData) {
  const callbackUrl = safePath(String(formData.get("callbackUrl") || "/account"));
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: callbackUrl,
    });
  } catch (e) {
    if (e instanceof AuthError) {
      redirect(`/login?error=CredentialsSignin`);
    }
    throw e;
  }
}
