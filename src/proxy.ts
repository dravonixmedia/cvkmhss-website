import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Next.js 16 renamed `middleware.ts` to `proxy.ts` (same mechanism, new
 * name/export — see node_modules/next/dist/docs/.../file-conventions/proxy.md).
 *
 * Scoped to /admin only via the matcher below, so this has zero effect on
 * the public website's routes/behavior — it exists purely to keep the
 * Supabase session cookie fresh for the admin backend.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
