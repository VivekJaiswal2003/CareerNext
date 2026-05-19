import { AuthForm } from "@/components/forms/auth-form";
import { Brand } from "@/components/layout/brand";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-soft">
        <Brand />
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">Reset password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter your email and we will send reset instructions.</p>
        <div className="mt-6"><AuthForm mode="forgot" /></div>
      </div>
    </main>
  );
}
