"use client";

import { useState } from "react";
import { Loader2, ScanSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useResumeAnalysis } from "@/hooks/use-resume-analysis";
import { useToast } from "@/components/ui/toast-provider";

type MatchResult = {
  compatibility: number;
  missingSkills: string[];
  keywordGaps: string[];
  recruiterRisks: string[];
  improvementPlan: string[];
};

const initial: MatchResult = {
  compatibility: 73,
  missingSkills: ["CI/CD exposure", "REST API testing", "Production monitoring"],
  keywordGaps: ["unit tests", "agile delivery", "observability"],
  recruiterRisks: ["Project evidence is relevant but not yet tailored to this job."],
  improvementPlan: ["Add exact truthful keywords from the JD.", "Move the most relevant project above older coursework."]
};

export function JdMatcher() {
  const { analysis } = useResumeAnalysis();
  const { toast } = useToast();
  const [jd, setJd] = useState("We are looking for an intern with strong problem solving, project ownership, testing habits, and experience building reliable software or embedded systems.");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(initial);

  async function match() {
    setLoading(true);
    try {
      const response = await fetch("/api/resume/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jd, resumeSummary: analysis?.summary ?? "" })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not match JD");
      setResult(payload);
      toast({ title: "JD match complete", description: `${payload.compatibility}% compatibility estimate generated.` });
    } catch (error) {
      toast({ variant: "error", title: "Matcher failed", description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Job description matcher</CardTitle></CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-3">
          <Textarea value={jd} onChange={(event) => setJd(event.target.value)} className="min-h-44" aria-label="Job description" />
          <Button onClick={match} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />}
            Match against resume
          </Button>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Compatibility</p>
              <p className="text-2xl font-semibold">{result.compatibility}%</p>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${result.compatibility}%` }} />
            </div>
          </div>
          <KeywordBlock title="Missing skills" items={result.missingSkills} />
          <KeywordBlock title="ATS keyword gaps" items={result.keywordGaps} />
          <div className="rounded-lg border p-4">
            <p className="text-sm font-semibold">Improvement plan</p>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {result.improvementPlan.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function KeywordBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => <Badge key={item}>{item}</Badge>)}
      </div>
    </div>
  );
}
