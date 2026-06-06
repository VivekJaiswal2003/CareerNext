"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Plus, StickyNote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";
import type { ApplicationStatus } from "@/types";

type ApplicationItem = {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  date: string;
  notes: string;
  interviewDate?: string;
};

const statuses: ApplicationStatus[] = ["Applied", "Interview Scheduled", "Rejected", "Offer Received"];

const fallbackApplications: ApplicationItem[] = [];

function formatDate(value?: string) {
  if (!value) return "Recent";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function ApplicationsPage() {
  const [searchFilter, setSearchFilter] = useState("");
  const { toast } = useToast();
  const [applications, setApplications] = useState<ApplicationItem[]>(fallbackApplications);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<ApplicationItem | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("careernext.applications");
    if (stored) setApplications(JSON.parse(stored) as ApplicationItem[]);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setSearchFilter(params.get("search")?.toLowerCase() ?? "");
    }

    async function loadApplications() {
      try {
        const response = await fetch("/api/applications");
        const payload = await response.json();
        if (response.ok && Array.isArray(payload.applications)) {
          setApplications(
            payload.applications.map((app: any) => ({
              id: app._id || app.id || crypto.randomUUID(),
              company: app.company,
              role: app.role,
              status: app.status,
              date: formatDate(app.appliedAt || app.createdAt),
              notes: app.notes || app.nextStep || "",
              interviewDate: app.interviewDate ? formatDate(app.interviewDate) : undefined
            }))
          );
        }
      } catch {
        // Keep cached state when the API is unavailable.
      }
    }

    void loadApplications();
  }, []);

  function persist(next: ApplicationItem[]) {
    window.localStorage.setItem("careernext.applications", JSON.stringify(next));
  }

  async function addApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next: ApplicationItem = {
      id: crypto.randomUUID(),
      company: String(form.get("company") || "").trim(),
      role: String(form.get("role") || "").trim(),
      status: String(form.get("status")) as ApplicationStatus,
      date: "Today",
      notes: String(form.get("notes") || "").trim(),
      interviewDate: String(form.get("interviewDate") || "") || undefined
    };

    setApplications((current) => {
      const updated = [next, ...current];
      persist(updated);
      return updated;
    });
    setModalOpen(false);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: next.company,
          role: next.role,
          status: next.status,
          notes: next.notes,
          interviewDate: next.interviewDate,
          nextStep: next.interviewDate ? `Interview on ${next.interviewDate}` : undefined
        })
      });
      const payload = await response.json();
      if (response.ok) {
        toast({ title: "Application added", description: `${next.company} is now in your tracker.` });
      } else {
        throw new Error(payload.error || "Save failed");
      }
    } catch (error) {
      toast({ variant: "error", title: "Request failed", description: error instanceof Error ? error.message : "Unable to save application." });
    }
  }

  async function updateStatus(id: string, status: ApplicationStatus) {
    setApplications((current) => {
      const updated = current.map((app) => (app.id === id ? { ...app, status } : app));
      persist(updated);
      return updated;
    });

    try {
      await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      toast({ title: "Status updated", description: `Moved to ${status}.` });
    } catch {
      toast({ variant: "error", title: "Update failed", description: "Could not update status." });
    }
  }

  function updateSelectedField(field: "notes" | "interviewDate", value: string) {
    if (!selected) return;
    const next = { ...selected, [field]: value };
    setSelected(next);
    setApplications((current) => {
      const updated = current.map((app) => (app.id === next.id ? next : app));
      persist(updated);
      return updated;
    });
  }

  const grouped = useMemo(
    () => statuses.map((status) => ({ status, items: applications.filter((app) => app.status === status) })),
    [applications]
  );

  const filteredApplications = useMemo(() => {
    if (!searchFilter) return applications;
    return applications.filter((app) =>
      app.company.toLowerCase().includes(searchFilter) ||
      app.role.toLowerCase().includes(searchFilter) ||
      app.notes.toLowerCase().includes(searchFilter)
    );
  }, [applications, searchFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track every internship conversation with next steps and outcomes.</p>
          {searchFilter ? <p className="mt-2 text-sm text-muted-foreground">Showing results for “{searchFilter}”.</p> : null}
        </div>
        <Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" />Add company</Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {grouped.map(({ status, items }) => (
          <Card
            key={status}
            className="min-h-48"
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (draggedId) void updateStatus(draggedId, status);
              setDraggedId(null);
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm">{status}</CardTitle>
              <Badge>{items.length}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.length === 0 && <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">No applications here yet.</p>}
              {items.map((app) => (
                <button
                  key={app.id}
                  draggable
                  onDragStart={() => setDraggedId(app.id)}
                  onClick={() => setSelected(app)}
                  className="w-full cursor-grab rounded-md border p-3 text-left transition hover:border-primary hover:bg-muted/40 active:cursor-grabbing"
                >
                  <p className="text-sm font-medium">{app.company}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{app.role}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>{app.date}</span>
                    {app.interviewDate && (
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{app.interviewDate}</span>
                    )}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Application table</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b">
                <th className="py-3 font-medium">Company</th>
                <th className="py-3 font-medium">Role</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium">Interview</th>
                <th className="py-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id} className="border-b last:border-0">
                  <td className="py-3">{app.company}</td>
                  <td className="py-3">{app.role}</td>
                  <td className="py-3">
                    <select
                      aria-label={`Update ${app.company} status`}
                      className="rounded-md border bg-background px-2 py-1 text-sm"
                      value={app.status}
                      onChange={(event) => void updateStatus(app.id, event.target.value as ApplicationStatus)}
                    >
                      {statuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 text-muted-foreground">{app.interviewDate || "Not scheduled"}</td>
                  <td className="py-3 text-muted-foreground"><StickyNote className="mr-1 inline h-3 w-3" />{app.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <form onSubmit={(event) => void addApplication(event)} className="w-full max-w-lg rounded-lg border bg-background p-5 shadow-soft">
            <h2 className="text-lg font-semibold">Add application</h2>
            <div className="mt-4 grid gap-3">
              <Input name="company" placeholder="Company" required />
              <Input name="role" placeholder="Role" required />
              <select name="status" className="h-10 rounded-md border bg-background px-3 text-sm">
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <Input name="interviewDate" type="date" />
              <Textarea name="notes" placeholder="Notes or next step" />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button>Add application</Button>
            </div>
          </form>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-lg border bg-background p-5 shadow-soft">
            <h2 className="text-lg font-semibold">{selected.company}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{selected.role}</p>
            <div className="mt-4 space-y-3">
              <Textarea value={selected.notes} onChange={(event) => updateSelectedField("notes", event.target.value)} />
              <Input type="date" value={selected.interviewDate || ""} onChange={(event) => updateSelectedField("interviewDate", event.target.value)} />
            </div>
            <div className="mt-5 flex justify-between items-center gap-2">
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
              <Button onClick={async () => {
                if (!selected) return;
                try {
                  await fetch("/api/applications", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: selected.id, notes: selected.notes, interviewDate: selected.interviewDate })
                  });
                  toast({ title: "Application updated", description: "Notes and interview details were saved." });
                } catch {
                  toast({ variant: "error", title: "Update failed", description: "Unable to save the application." });
                }
                setSelected(null);
              }}>Save changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
