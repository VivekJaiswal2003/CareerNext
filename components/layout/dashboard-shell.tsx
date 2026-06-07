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
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r bg-background/95 backdrop-blur lg:block">
        <div className="flex h-20 items-center border-b border-border/70 px-6">
          <Brand />
        </div>
        <SidebarNav
          pathname={pathname}
          profile={profile}
          profileLoading={profileLoading}
          onNavigate={() => {}}
          onLogout={logout}
          onToggleTheme={toggleTheme}
        />
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
            <SidebarNav
              pathname={pathname}
              profile={profile}
              profileLoading={profileLoading}
              onNavigate={() => setDrawerOpen(false)}
              onLogout={logout}
              onToggleTheme={toggleTheme}
            />
          </aside>
        </div>
      )}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/90 px-4 backdrop-blur sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setDrawerOpen(true)} aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden sm:block lg:hidden">
            <Brand />
          </div>
          <div className="relative max-w-xl flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search applications, roles, companies"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search applications"
            />
          </div>
          <button className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
          </button>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle dark mode">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md p-1.5 hover:bg-muted">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-medium text-white dark:bg-white dark:text-slate-950">
                {profileLoading ? "..." : initials(displayName)}
              </span>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
            </summary>
            <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-background p-2 shadow-soft">
              <div className="px-3 py-2">
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

function SidebarNav({ pathname, profile, profileLoading, onNavigate, onLogout, onToggleTheme }: { pathname: string; profile: { name?: string; email?: string } | null; profileLoading: boolean; onNavigate?: () => void; onLogout: () => void; onToggleTheme: () => void; }) {
  return (
    <nav className="flex h-full flex-col justify-between px-4 py-6">
      <div className="space-y-4">
        <div className="rounded-3xl border border-border/70 bg-muted p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Workspace</p>
          <p className="mt-3 text-sm font-semibold text-foreground">CareerNext</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Track applications, optimize resumes, and prepare interviews with confidence.</p>
        </div>
        <div className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-3xl px-4 py-3 text-sm transition hover:bg-muted hover:text-foreground",
                  active ? "bg-primary/10 font-semibold text-foreground" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="space-y-4 rounded-3xl border border-border/70 bg-muted p-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">{initials(profile?.name?.trim() || "Student")}</span>
          <div>
            <p className="text-sm font-medium">{profile?.name?.trim() || "Student"}</p>
            <p className="text-xs text-muted-foreground">{profile?.email?.trim() || "Career workspace"}</p>
          </div>
        </div>
        <div className="grid gap-2">
          <Button variant="outline" className="w-full" onClick={onToggleTheme}>Theme</Button>
          <Button variant="secondary" className="w-full" onClick={onLogout}>Sign out</Button>
        </div>
      </div>
    </nav>
  );
}
