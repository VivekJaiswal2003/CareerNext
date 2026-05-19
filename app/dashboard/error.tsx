"use client";

import Link from "next/link";

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-8 text-center shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Dashboard error</p>
        <h1 className="mt-4 text-3xl font-semibold">Unable to load dashboard content.</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">Try refreshing or return to the home page. Your data is safe.</p>
        <pre className="mt-4 overflow-x-auto rounded-md bg-muted p-3 text-left text-xs text-red-500">{error?.message}</pre>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90" onClick={() => reset()}>
            Retry
          </button>
          <Link href="/" className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold transition hover:bg-muted">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
