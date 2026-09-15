"use client";

import type { FormEvent } from "react";

/**
 * Wraps a delete server action with a native confirm() prompt so a
 * destructive action isn't a single accidental click — deliberately the
 * simplest mechanism that achieves that, not a custom modal. Shared
 * across every Admin CMS module (Management & Leadership, News, Events,
 * Achievements, Notices, Downloads, Gallery).
 */
export function ConfirmDeleteForm({
  action,
  itemLabel,
  confirmMessage,
}: {
  action: () => Promise<void>;
  itemLabel: string;
  confirmMessage?: string;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(confirmMessage ?? `Delete ${itemLabel}? This cannot be undone.`)) {
      event.preventDefault();
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit}>
      <button
        type="submit"
        className="border border-transparent px-2 py-1 text-xs font-semibold tracking-wide text-red-700 uppercase transition hover:border-red-700"
      >
        Delete
      </button>
    </form>
  );
}
