import type { NextConfig } from "next";

// Allows next/image to serve signed Supabase Storage URLs (Management &
// Leadership photos). Derived from the configured project URL rather than
// hardcoded, so this keeps working if the connected project ever changes.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
