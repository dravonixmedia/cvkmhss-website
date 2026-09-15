"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/lib/auth/actions";

const initialState: LoginState = {};

const fieldClasses =
  "mt-2 w-full border border-border bg-off-white px-3 py-2.5 text-sm text-charcoal " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-0";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div>
        <label htmlFor="email" className="block text-xs font-semibold tracking-wide text-navy uppercase">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={pending}
          className={fieldClasses}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-semibold tracking-wide text-navy uppercase"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={pending}
          className={fieldClasses}
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="w-full bg-navy px-4 py-2.5 text-sm font-semibold tracking-wide text-white uppercase transition duration-200 ease-out hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
