/**
 * Reads and validates the public Supabase env vars shared by the browser
 * and server clients. Throws a clear error at the point of use rather than
 * letting `createBrowserClient`/`createServerClient` fail with an opaque
 * "Invalid URL" error when the project isn't configured yet.
 */
export function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (see .env.example) once the " +
        "CVKM Supabase project exists."
    );
  }

  return { url, publishableKey };
}
