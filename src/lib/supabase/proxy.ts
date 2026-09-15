import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

/**
 * Refreshes the Supabase auth session cookie on protected admin routes.
 *
 * This performs an OPTIMISTIC check only, per Next.js's own guidance:
 * Proxy runs on every matched request (including prefetches), so it must
 * stay cheap and must not be the only authorization boundary. The
 * authoritative check — is this user's profile active, does it have an
 * allowed role — happens server-side in `requireAdmin`/`requireSuperAdmin`
 * (src/lib/auth/session.ts), which queries the `profiles` table directly
 * on every protected render. This function's job is narrower: keep the
 * session cookie valid, and bounce obviously-unauthenticated requests to
 * `/admin/login` early.
 *
 * Do not run code between `createServerClient` and `getClaims()` below —
 * a stray early return here can leave sessions randomly logged out.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  let publicConfig: ReturnType<typeof getSupabasePublicConfig>;
  try {
    publicConfig = getSupabasePublicConfig();
  } catch {
    // Supabase isn't configured yet (no live project connected). Let the
    // request through unchanged — the admin layout's server-side checks
    // will redirect to /admin/login regardless, and the public site must
    // keep working even while Supabase setup is incomplete.
    return supabaseResponse;
  }

  const supabase = createServerClient(publicConfig.url, publicConfig.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const path = request.nextUrl.pathname;
  const isLoginRoute = path === "/admin/login";

  if (!user && !isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: return supabaseResponse as-is (or copy its cookies onto a
  // replacement) so refreshed auth cookies actually reach the browser.
  return supabaseResponse;
}
