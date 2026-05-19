import { AuthForm } from "@/components/forms/auth-form";
import { Brand } from "@/components/layout/brand";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-soft">
        <Brand />
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">Create your workspace</h1>
        <p className="mt-2 text-sm text-muted-foreground">Start with a resume review and a focused opportunity plan.</p>
        <div className="mt-6"><AuthForm mode="signup" /></div>
      </div>
    </main>
  );
}
