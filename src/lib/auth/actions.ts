"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface LoginState {
  error?: string;
}

/**
 * Generic, non-enumerating error message for every failure mode below:
 * missing fields, unknown email, wrong password, or an unexpected
 * Supabase error. Never reveals which part was wrong, and never surfaces
 * Supabase's internal error text to the client.
 */
const GENERIC_LOGIN_ERROR = "Unable to sign in. Please check your credentials.";
const NOT_CONFIGURED_ERROR =
  "Admin sign-in is not available yet: no Supabase project is connected. " +
  "See docs/SUPABASE_SETUP.md.";

export async function signIn(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: GENERIC_LOGIN_ERROR };
  }

  let supabase: Awaited<ReturnType<typeof createClient>>;
  try {
    supabase = await createClient();
  } catch {
    return { error: NOT_CONFIGURED_ERROR };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: GENERIC_LOGIN_ERROR };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
