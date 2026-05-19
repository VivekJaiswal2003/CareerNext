"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";

export function AuthForm({ mode }: { mode: "login" | "signup" | "forgot" }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const isSignup = mode === "signup";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";

    try {
      if (mode === "forgot") {
        toast({ title: "Reset link prepared", description: "In production this would send an email through the configured provider." });
      } else {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Authentication failed");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      toast({ variant: "error", title: "Could not continue", description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {isSignup && <Input name="name" placeholder="Full name" required />}
      {mode !== "forgot" && <Input name="email" type="email" placeholder="Email address" required />}
      {mode === "forgot" && <Input name="email" type="email" placeholder="Your account email" required />}
      {mode !== "forgot" && <Input name="password" type="password" placeholder="Password" required minLength={8} />}
      <Button className="w-full" disabled={loading}>
        {loading ? "Working..." : mode === "login" ? "Login" : mode === "signup" ? "Create account" : "Send reset link"}
        <ArrowRight className="h-4 w-4" />
      </Button>
      {mode === "login" && (
        <div className="flex justify-between text-sm text-muted-foreground">
          <Link href="/signup" className="hover:text-foreground">Create account</Link>
          <Link href="/forgot-password" className="hover:text-foreground">Forgot password?</Link>
        </div>
      )}
      {mode === "signup" && (
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="text-foreground">Login</Link>
        </p>
      )}
    </form>
  );
}
