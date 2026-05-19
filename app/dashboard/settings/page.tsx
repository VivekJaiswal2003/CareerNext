"use client";

import { useEffect, useState } from "react";
import { Github, Mail, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast-provider";

const defaultProfile = {
  name: "",
  email: "",
  targetRole: "",
  skills: "",
  interests: "",
  locations: "",
  companies: "",
  graduationYear: "",
  github: "",
  linkedin: "",
  portfolio: ""
};

const defaultPreferences = {
  theme: "system",
  weeklyDigest: true,
  applicationReminders: true,
  resumeVisibility: true
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState(defaultProfile);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("careernext.theme");
    if (storedTheme) setPreferences((current) => ({ ...current, theme: storedTheme as typeof defaultPreferences.theme }));

    fetch("/api/user/profile")
      .then((response) => response.json())
      .then((payload) => {
        if (payload.profile) {
          setProfile({
            name: payload.profile.name || "",
            email: payload.profile.email || "",
            targetRole: payload.profile.targetRole || "",
            skills: payload.profile.skills || "",
            interests: payload.profile.interests || "",
            locations: payload.profile.locations || "",
            companies: payload.profile.companies || "",
            graduationYear: payload.profile.graduationYear || "",
            github: payload.profile.github || "",
            linkedin: payload.profile.linkedin || "",
            portfolio: payload.profile.portfolio || ""
          });
          if (payload.profile.preferences) {
            setPreferences({
              theme: payload.profile.preferences.theme || "system",
              weeklyDigest: payload.profile.preferences.weeklyDigest ?? true,
              applicationReminders: payload.profile.preferences.applicationReminders ?? true,
              resumeVisibility: payload.profile.preferences.resumeVisibility ?? true
            });
          }
        }
      })
      .catch(() => undefined);
  }, []);

  async function saveProfile() {
    setSaving(true);
    const response = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...profile, preferences })
    });
    setSaving(false);
    if (!response.ok) {
      toast({ variant: "error", title: "Profile save failed", description: "Please check the fields and try again." });
      return;
    }
    toast({ title: "Profile saved", description: "Your workspace profile has been updated." });
  }

  function updateTheme(theme: typeof defaultPreferences.theme) {
    setPreferences((current) => ({ ...current, theme }));
    window.localStorage.setItem("careernext.theme", theme);
    const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    toast({ title: "Theme updated", description: `Using ${theme} theme preference.` });
  }

  async function deleteAccount() {
    const confirmed = window.confirm("Delete your CareerNext account and all saved workspace data?");
    if (!confirmed) return;
    setDeleting(true);
    const response = await fetch("/api/user/delete", { method: "POST" });
    setDeleting(false);
    if (!response.ok) {
      toast({ variant: "error", title: "Delete failed", description: "Could not remove your account. Please try again." });
      return;
    }
    toast({ title: "Account deleted", description: "Your data has been removed." });
    window.location.href = "/signup";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile, notification preferences, theme, and workspace account.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input aria-label="Name" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} placeholder="Full name" />
            <Input aria-label="Email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} placeholder="Email address" />
            <Input aria-label="Target role" value={profile.targetRole} onChange={(event) => setProfile({ ...profile, targetRole: event.target.value })} placeholder="Target role" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input aria-label="Skills" value={profile.skills} onChange={(event) => setProfile({ ...profile, skills: event.target.value })} placeholder="Skills" />
              <Input aria-label="Interests" value={profile.interests} onChange={(event) => setProfile({ ...profile, interests: event.target.value })} placeholder="Interests" />
              <Input aria-label="Preferred locations" value={profile.locations} onChange={(event) => setProfile({ ...profile, locations: event.target.value })} placeholder="Preferred locations" />
              <Input aria-label="Preferred companies" value={profile.companies} onChange={(event) => setProfile({ ...profile, companies: event.target.value })} placeholder="Preferred companies" />
              <Input aria-label="Graduation year" value={profile.graduationYear} onChange={(event) => setProfile({ ...profile, graduationYear: event.target.value })} placeholder="Graduation year" />
              <Input aria-label="GitHub" value={profile.github} onChange={(event) => setProfile({ ...profile, github: event.target.value })} placeholder="GitHub" />
              <Input aria-label="LinkedIn" value={profile.linkedin} onChange={(event) => setProfile({ ...profile, linkedin: event.target.value })} placeholder="LinkedIn" />
              <Input aria-label="Portfolio" value={profile.portfolio} onChange={(event) => setProfile({ ...profile, portfolio: event.target.value })} placeholder="Portfolio" />
            </div>
            <Button onClick={() => void saveProfile()} disabled={saving}>{saving ? "Saving profile..." : "Save changes"}</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <Toggle label="Resume visible to mentors" checked={preferences.resumeVisibility} onChange={(value) => setPreferences((current) => ({ ...current, resumeVisibility: value }))} />
            <Toggle label="Weekly progress digest" checked={preferences.weeklyDigest} onChange={(value) => setPreferences((current) => ({ ...current, weeklyDigest: value }))} />
            <Toggle label="Application follow-up reminders" checked={preferences.applicationReminders} onChange={(value) => setPreferences((current) => ({ ...current, applicationReminders: value }))} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {(["system", "light", "dark"] as const).map((item) => (
              <Button key={item} variant={preferences.theme === item ? "default" : "outline"} onClick={() => updateTheme(item)}>
                {item[0].toUpperCase() + item.slice(1)}
              </Button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Connected accounts</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4" />Google</span>
              <Badge>Connected</Badge>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="flex items-center gap-2 text-sm"><Github className="h-4 w-4" />GitHub</span>
              <Button variant="outline" size="sm">Connect</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Delete account</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Permanently remove your CareerNext account and workspace data.</p>
            <Button variant="outline" onClick={deleteAccount} disabled={deleting}><Trash2 className="h-4 w-4" />{deleting ? "Deleting..." : "Delete account"}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center justify-between rounded-md border p-3">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4" />
    </label>
  );
}
