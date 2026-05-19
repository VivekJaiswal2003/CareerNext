import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/toast-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerNext",
  description: "Helping students move from learning to opportunity."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body><ToastProvider>{children}</ToastProvider></body>
    </html>
  );
}
