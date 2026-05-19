import { AuthForm } from "@/components/forms/auth-form";
import { Brand } from "@/components/layout/brand";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-soft">
        <Brand />
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Login to continue building your career plan.</p>
        <div className="mt-6"><AuthForm mode="login" /></div>
      </div>
    </main>
  );
}
