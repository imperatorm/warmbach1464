"use client";

import { useFormState, useFormStatus } from "react-dom";
import { enter, type EnterState } from "@/app/enter/actions";

const initial: EnterState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      data-cursor
      className="btn-primary mt-7 w-full justify-center disabled:opacity-50"
    >
      {pending ? "Einen Moment …" : "Eintreten →"}
    </button>
  );
}

export function EnterForm({ from }: { from: string }) {
  const [state, action] = useFormState(enter, initial);
  return (
    <form action={action} className="mt-10">
      <input type="hidden" name="from" value={from} />
      <input
        name="password"
        type="password"
        autoFocus
        required
        autoComplete="current-password"
        aria-label="Passwort"
        placeholder="Passwort"
        className="w-full border border-hairline/30 bg-soot/40 px-5 py-4 text-center tracking-[0.2em] text-cream placeholder:text-stone/50 focus:border-gold focus:outline-none"
      />
      {state.error && (
        <p role="alert" className="mt-4 text-xs uppercase tracking-[0.15em] text-gold">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
