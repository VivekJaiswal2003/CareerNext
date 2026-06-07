"use client";

import { Brain, BriefcaseBusiness, Eye, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeAnalysis } from "@/lib/resume-analysis";
import { useResumeAnalysis } from "@/hooks/use-resume-analysis";

export function AiInsightsPanel() {
  const { analysis } = useResumeAnalysis();
  const report = normalizeAnalysis(analysis);
  const weaknesses = report.weaknesses;
  const missing = report.missingSkills;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review notes</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Insight icon={Brain} title="Resume weakness" text={weaknesses[0] ?? "No major weaknesses found."} />
        <Insight icon={TrendingUp} title="Opportunity" text={report.recommendations[0] ?? "Use the dashboard suggestions to sharpen your next update."} />
        <Insight icon={BriefcaseBusiness} title="Skills to emphasize" text={(missing || []).slice(0, 3).join(", ") || "Your keywords are on target; keep them clear."} />
        <Insight icon={Eye} title="Recruiter note" text={report.roleFit.analysis || "Clarify project outcomes and role contributions."} />
      </CardContent>
    </Card>
  );
}

function Insight({ icon: Icon, title, text }: { icon: typeof Brain; title: string; text: string }) {
  return (
    <div className="pressable rounded-lg border bg-muted/20 p-4">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}
