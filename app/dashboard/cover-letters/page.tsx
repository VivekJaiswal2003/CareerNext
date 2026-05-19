"use client";

import { useState } from "react";
import { Copy, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";

const initialLetter = `Dear Hiring Team,

I am applying for the Embedded Software Internship because my recent work in microcontroller-based sensing systems aligns closely with the role. In my final-year project, I built a sensor pipeline that combined firmware, calibration, and a lightweight dashboard to make testing easier for the team.

I would bring careful debugging habits, strong fundamentals in C/C++, and a practical interest in building reliable products. I am especially excited by teams that connect hardware constraints with thoughtful software design.

Thank you for considering my application.

Sincerely,
Anaya Rao`;

export default function CoverLettersPage() {
  const { toast } = useToast();
  const [company, setCompany] = useState("Northstar Labs");
  const [role, setRole] = useState("Embedded Software Intern");
  const [jobDescription, setJobDescription] = useState("");
  const [letter, setLetter] = useState(initialLetter);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const response = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, role, jobDescription, profileSummary: "ECE student with embedded systems and product project experience." })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not generate letter");
      setLetter(payload.content);
      toast({ title: "Cover letter generated", description: "The editor has been updated." });
    } catch (error) {
      toast({ variant: "error", title: "Generation failed", description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(letter);
    toast({ title: "Copied", description: "Cover letter copied to clipboard." });
  }

  function exportPdf() {
    window.print();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Cover Letters</h1>
        <p className="mt-1 text-sm text-muted-foreground">Generate, edit, copy, and export tailored cover letters.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader><CardTitle>Job context</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Company" />
            <Input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Role" />
            <Textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste job description..." />
            <Button onClick={generate} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Generate letter
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Editor</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copy}><Copy className="h-4 w-4" />Copy</Button>
                <Button variant="outline" size="sm" onClick={exportPdf}><Download className="h-4 w-4" />PDF</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea className="min-h-[430px] resize-none font-serif text-base leading-8" value={letter} onChange={(event) => setLetter(event.target.value)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
