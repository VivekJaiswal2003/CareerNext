"use client";

import { Brain, BriefcaseBusiness, Eye, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeAnalysis } from "@/lib/resume-analysis";
import { useResumeAnalysis } from "@/hooks/use-resume-analysis";

export function AiInsightsPanel() {
  const { analysis } = useResumeAnalysis();
  const report = normalizeAnalysis(analysis);
  const weaknesses = report.weaknesses;
  const missing = report.missingSkills;
  const probability = Math.min(92, Math.round(((report.atsScore ?? 0) + (report.roleFit.score ?? 0)) / 2) - 9);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>AI career insights</CardTitle>
          <Badge>{probability}% hiring probability</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Insight icon={Brain} title="Resume weakness" text={weaknesses[0]} />
        <Insight icon={TrendingUp} title="Application trend" text="Responses improve when hardware-adjacent roles are prioritized over broad software roles." />
        <Insight icon={BriefcaseBusiness} title="Suggested skills" text={missing.slice(0, 3).join(", ")} />
        <Insight icon={Eye} title="Recruiter impression" text={report.roleFit.analysis} />
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
