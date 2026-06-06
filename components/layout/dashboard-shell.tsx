"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import { useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
  FileText,
  Home,
  Layers,
  Mail,
  Menu,
  MessageSquareText,
  Moon,
  PanelLeftClose,
  Search,
  Settings,
  Sparkles,
  Sun,
  TrendingUp
} from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, initials } from "@/lib/utils";

const navItems: { href: Route; label: string; icon: typeof Home }[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/resume", label: "Resume Analyzer", icon: FileText },
  { href: "/dashboard/applications", label: "Applications", icon: Layers },
  { href: "/dashboard/interviews", label: "Interviews", icon: MessageSquareText },
  { href: "/dashboard/recommendations", label: "Recommendations", icon: Sparkles },
  { href: "/dashboard/progress", label: "Progress", icon: TrendingUp },
  { href: "/dashboard/cover-letters", label: "Cover Letters", icon: Mail },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState<{ name?: string; email?: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem("careernext.theme");
    const nextDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
  }, []);

  useEffect(() => {
    let active = true;

    fetch("/api/user/profile")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (active) setProfile(payload?.profile ?? null);
      })
      .catch(() => {
        if (active) setProfile(null);
      })
      .finally(() => {
        if (active) setProfileLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/dashboard/applications?search=${encodeURIComponent(query)}` : "/dashboard");
  }

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("careernext.theme", next ? "dark" : "light");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const displayName = profile?.name?.trim() || "Student";
  const displayEmail = profile?.email?.trim();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r bg-background lg:block">
        <div className="flex h-16 items-center border-b px-6">
          <Brand />
        </div>
        <div className="flex h-[calc(100vh-64px)] flex-col justify-between">
          <SidebarNav pathname={pathname} />
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-medium text-white dark:bg-white dark:text-slate-950">{profileLoading ? "..." : initials(displayName)}</span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{profileLoading ? "Loading..." : displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{displayEmail || "Student workspace"}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Link href="/dashboard/settings" className="text-sm text-muted-foreground hover:text-foreground">Settings</Link>
              <button onClick={logout} className="ml-auto text-sm text-red-600 hover:underline">Logout</button>
            </div>
          </div>
        </div>
      </aside>
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-slate-950/40" aria-label="Close menu" onClick={() => setDrawerOpen(false)} />
          <aside className="relative h-full w-[min(88vw,20rem)] border-r bg-background shadow-soft">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <Brand />
              <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(false)} aria-label="Close navigation">
                <PanelLeftClose className="h-5 w-5" />
              </Button>
            </div>
            <SidebarNav pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/75 px-4 backdrop-blur-sm sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setDrawerOpen(true)} aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden sm:block lg:hidden">
            <Brand />
          </div>
          <div className="relative max-w-2xl flex-1">
            <Search className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-11 rounded-full bg-muted/40 py-2 pr-4"
              placeholder="Search applications, roles, companies"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search applications"
            />
          </div>
          <button className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[10px] text-white">•</span>
          </button>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle dark mode">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md p-1.5 hover:bg-muted">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-medium text-white dark:bg-white dark:text-slate-950">
                {profileLoading ? "..." : initials(displayName)}
              </span>
            </summary>
            <div className="absolute right-0 mt-2 w-64 rounded-lg border bg-background p-3 shadow-soft">
              <div className="px-2 py-2">
                <p className="text-sm font-medium">{profileLoading ? "Loading profile..." : displayName}</p>
                <p className="text-xs text-muted-foreground">{displayEmail || "Student workspace"}</p>
              </div>
              <Link className="block rounded-md px-3 py-2 text-sm hover:bg-muted" href="/dashboard/settings">Settings</Link>
              <button className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={logout}>
                Logout
              </button>
            </div>
          </details>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-2 p-4">
      {navItems.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
              active
                ? "bg-primary/5 text-foreground font-medium border-l-4 border-primary/70 pl-3"
                : "hover:bg-muted"
            )}
          >
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
