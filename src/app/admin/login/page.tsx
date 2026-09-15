import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { getAuthContext } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = buildMetadata({
  title: "Admin Sign In",
  description: "Sign in to the C V K M Higher Secondary School administration backend.",
  path: "/admin/login",
  noIndex: true,
});

export default async function AdminLoginPage() {
  const context = await getAuthContext();

  if (context) {
    if (context.profile.is_active) {
      redirect("/admin");
    }
    // A session exists but the profile is inactive — sign out server-side
    // so a stale session cookie doesn't linger for a deactivated user.
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // Supabase not configured; nothing to sign out of.
    }
  }

  return (
    <section className="flex min-h-[65vh] items-center justify-center px-4 py-16 sm:py-20">
      <div className="w-full max-w-sm border border-border bg-paper p-8 shadow-sm">
        <h1 className="font-heading text-xl font-semibold text-navy">Admin Sign In</h1>
        <p className="mt-1 text-sm text-slate">
          C V K M Higher Secondary School — administration backend.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
