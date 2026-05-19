"use client";

import Link from "next/link";
import { Award, BriefcaseBusiness, FileCheck2, TrendingUp } from "lucide-react";
import { ActivityList } from "@/components/dashboard/activity-list";
import { AiInsightsPanel } from "@/components/dashboard/ai-insights-panel";
import { JdMatcher } from "@/components/dashboard/jd-matcher";
import { ProgressChart } from "@/components/dashboard/progress-chart";
import { ResumeUploader } from "@/components/dashboard/resume-uploader";
import { StatCard } from "@/components/dashboard/stat-card";
import { WeeklyPlanner } from "@/components/dashboard/weekly-planner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResumeAnalysis } from "@/hooks/use-resume-analysis";

export function DashboardHome() {
  const { analysis } = useResumeAnalysis();
  const atsScore = analysis?.atsScore ?? 82;
  const roleFit = analysis?.roleFit?.score ?? 84;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-xl border bg-background p-5 shadow-sm sm:p-6">
          <div className="max-w-2xl">
            <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200">Career workspace</Badge>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">Move from applications to interviews with a clearer plan.</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Upload your resume, review ATS gaps, practice targeted interviews, and keep every internship conversation moving.
            </p>
          </div>
          <div className="mt-5">
            <ResumeUploader compact />
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Latest resume analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm text-muted-foreground">ATS score</p>
                <p className="mt-1 text-4xl font-semibold">{atsScore}</p>
              </div>
              <Badge>{roleFit}% role fit</Badge>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {analysis?.summary ?? "Upload a resume to replace this demo snapshot with an immediate Gemini-backed report."}
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/resume">Open full report</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Resume score" value={`${atsScore}/100`} hint="Updates after every upload" icon={FileCheck2} />
        <StatCard label="Applications sent" value="7" hint="3 awaiting response" icon={BriefcaseBusiness} />
        <StatCard label="Interview readiness" value="76%" hint="Technical round needs practice" icon={Award} />
        <StatCard label="Skill growth" value="+14%" hint="Embedded C and DSA improved" icon={TrendingUp} />
      </div>
      <AiInsightsPanel />
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <WeeklyPlanner />
        <JdMatcher />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <ProgressChart />
        <ActivityList />
      </div>
      <Card>
        <CardHeader><CardTitle>This week</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {(analysis?.improvementSuggestions ?? [
            "Rewrite power systems project with outcomes",
            "Practice 12 ECE fundamentals questions",
            "Apply to two hardware validation internships"
          ]).slice(0, 3).map((task) => (
            <button key={task} className="rounded-md border p-4 text-left text-sm transition hover:border-primary hover:bg-muted/50">{task}</button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
