import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/lib/auth/actions";
import type { ProfileRow } from "@/lib/supabase/database.types";

interface NavLeaf {
  label: string;
  href?: string;
}

const contentNav: NavLeaf[] = [
  { label: "News" },
  { label: "Events" },
  { label: "Achievements" },
  { label: "Notices" },
  { label: "Downloads" },
  { label: "Gallery" },
];

const administrationNav: NavLeaf[] = [{ label: "Users" }, { label: "Settings" }];

function NavGroup({ heading, items }: { heading: string; items: NavLeaf[] }) {
  return (
    <div className="mt-6">
      <p className="px-3 text-[11px] font-semibold tracking-wider text-slate uppercase">
        {heading}
      </p>
      <ul className="mt-2 space-y-0.5">
        {items.map((item) => (
          <li key={item.label}>
            <span className="flex items-center justify-between px-3 py-2 text-sm text-slate/70">
              {item.label}
              <span className="rounded-sm border border-border px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-slate uppercase">
                Soon
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminShell({
  profile,
  email,
  children,
}: {
  profile: ProfileRow;
  email: string | null;
  children: ReactNode;
}) {
  const roleLabel = profile.role === "super_admin" ? "Super Admin" : "Editor";

  return (
    <div className="min-h-screen bg-off-white">
      <header className="flex items-center justify-between border-b border-border bg-navy px-4 py-3 sm:px-6">
        <div>
          <p className="font-heading text-sm font-semibold text-white">CVKM HSS — Admin</p>
          <p className="text-xs text-white/60">Internal administration backend</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium text-white">{profile.full_name || email}</p>
            <p className="text-[11px] text-white/60">{roleLabel}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="border border-white/30 px-3 py-1.5 text-xs font-semibold tracking-wide text-white uppercase transition hover:bg-white/10"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <nav className="hidden w-56 shrink-0 border-r border-border bg-paper px-2 py-6 md:block">
          <Link
            href="/admin"
            className="block px-3 py-2 text-sm font-semibold text-navy hover:bg-off-white"
          >
            Dashboard
          </Link>
          <NavGroup heading="Content" items={contentNav} />
          <NavGroup heading="Administration" items={administrationNav} />
        </nav>

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
