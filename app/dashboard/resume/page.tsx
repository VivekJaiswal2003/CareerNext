"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ResumeUploader } from "@/components/dashboard/resume-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast-provider";
import { useResumeAnalysis } from "@/hooks/use-resume-analysis";
import { normalizeAnalysis, resumeAnalysisFallback } from "@/lib/resume-analysis";

export default function ResumeAnalyzerPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const { toast } = useToast();
  const { analysis, setAnalysis } = useResumeAnalysis();
  const safeAnalysis = normalizeAnalysis(analysis ?? resumeAnalysisFallback);
  const report = safeAnalysis;
  const roleFit = safeAnalysis.roleFit;
  const isEmptyState = analysis === null;

  async function analyze() {
    if (resumeText.trim().length < 20) {
      toast({ variant: "error", title: "Add resume text", description: "Paste at least a few resume bullets or upload a file." });
      return;
    }
    setAnalyzing(true);
    try {
      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: resumeText, fileName: "pasted-resume.txt", fileType: "text/plain" })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Analysis failed");
      setAnalysis(payload);
      toast({ title: "Resume analyzed", description: "The report below has been refreshed." });
    } catch (error) {
      toast({ variant: "error", title: "Analysis failed", description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setAnalyzing(false);
    }
  }

  function downloadReport() {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "careernext-resume-analysis.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Resume Analyzer</h1>
        <p className="mt-1 text-sm text-muted-foreground">Upload a resume or paste text to receive an ATS-oriented review.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader><CardTitle>Resume input</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <ResumeUploader />
            <Textarea value={resumeText} onChange={(event) => setResumeText(event.target.value)} placeholder="Or paste resume text here for a fast analysis pass..." />
            <Button onClick={analyze} disabled={analyzing}>
              {analyzing && <Loader2 className="h-4 w-4 animate-spin" />}
              {analyzing ? "Analyzing resume..." : "Analyze pasted resume"}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Analysis report</CardTitle>
              <Button variant="outline" size="sm" onClick={downloadReport}>Download report</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ATS score</p>
                  <p className="mt-1 text-4xl font-semibold">{report.atsScore}</p>
                </div>
                <Badge className="w-fit bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                  {roleFit.score}% fit for {roleFit.role}
                </Badge>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{isEmptyState ? "Upload or paste your first resume to generate a complete report." : report.summary}</p>
              <ReportBlock title="Strengths" items={report.strengths} />
              <ReportBlock title="Weaknesses" items={report.weaknesses} />
              <ReportBlock title="Missing keywords" items={report.missingSkills} />
              <ReportBlock title="Improvement suggestions" items={report.improvementSuggestions} />
              <div className="rounded-lg border p-4">
                <p className="text-sm font-semibold">Project quality: {report.projectQuality.score ?? 0}/100</p>
                <p className="mt-2 text-sm text-muted-foreground">{report.projectQuality.notes || "No feedback available."}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReportBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-2 space-y-2">
        {items.length > 0 ? (
          items.map((item) => <div key={item} className="rounded-md border px-3 py-2 text-sm">{item}</div>)
        ) : (
          <div className="rounded-md border px-3 py-2 text-sm text-muted-foreground">No items available.</div>
        )}
      </div>
    </div>
  );
}
