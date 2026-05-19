export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-border bg-card shadow-lg">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    </div>
  );
}
