"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useResumeAnalysis } from "@/hooks/use-resume-analysis";

type AtsPoint = { week: string; score: number };
type ReadinessPoint = { area: string; value: number };
type ApplicationPoint = { week: string; count: number };

const atsTrend: AtsPoint[] = [];

const readiness: ReadinessPoint[] = [];

const applications: ApplicationPoint[] = [];

export default function ProgressPage() {
  const { analysis } = useResumeAnalysis();
  const currentScore = typeof analysis?.atsScore === "number" ? analysis.atsScore : null;
  const trend = currentScore !== null ? [...atsTrend.slice(0, -1), { week: "Current", score: currentScore }] : atsTrend;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Progress</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track resume quality, interview readiness, applications, and skill growth.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Current resume score</p>
            <p className="mt-2 text-3xl font-semibold">{currentScore ?? "—"}</p>
            <p className="mt-4 text-xs text-muted-foreground">Upload or analyze a resume to see a score.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Interview readiness</p>
            <p className="mt-2 text-3xl font-semibold">{analysis?.roleFit?.score ?? "—"}</p>
            <p className="mt-4 text-xs text-muted-foreground">Practice answers to improve this metric.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Applications sent</p>
            <p className="mt-2 text-3xl font-semibold">{applications.length ? applications.reduce((s, a) => s + (a.count || 0), 0) : "—"}</p>
            <p className="mt-4 text-xs text-muted-foreground">Track sent applications here as you add them.</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader><CardTitle>ATS improvement trend</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" />
                <YAxis domain={[40, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#2f5f99" fill="#dbeafe" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Interview readiness</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={readiness}>
                <XAxis dataKey="area" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#2f5f99" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Application progress</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={applications}>
              <XAxis dataKey="week" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#334155" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
