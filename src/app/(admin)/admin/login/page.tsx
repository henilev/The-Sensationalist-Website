"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function AdminLoginPage() {
  const [error, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <form action={formAction} className="w-full max-w-sm rounded border border-ink/10 bg-white p-8">
        <h1 className="text-xl font-bold">The Sensationalist Admin</h1>
        <p className="mt-1 text-sm text-ink/60">Sign in to manage content.</p>

        <label className="mt-6 block text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="username"
            className="mt-1 w-full rounded border border-ink/20 px-3 py-2 text-sm"
          />
        </label>

        <label className="mt-4 block text-sm font-medium">
          Password
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded border border-ink/20 px-3 py-2 text-sm"
          />
        </label>

        {error && <p className="mt-4 text-sm text-burgundy">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full rounded bg-navy py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
