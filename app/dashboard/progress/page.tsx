"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useResumeAnalysis } from "@/hooks/use-resume-analysis";

const atsTrend = [
  { week: "Week 1", score: 58 },
  { week: "Week 2", score: 64 },
  { week: "Week 3", score: 71 },
  { week: "Week 4", score: 76 },
  { week: "Week 5", score: 82 }
];

const readiness = [
  { area: "HR", value: 84 },
  { area: "Technical", value: 72 },
  { area: "ECE", value: 78 },
  { area: "Projects", value: 86 }
];

const applications = [
  { week: "W1", count: 2 },
  { week: "W2", count: 3 },
  { week: "W3", count: 5 },
  { week: "W4", count: 7 }
];

export default function ProgressPage() {
  const { analysis } = useResumeAnalysis();
  const currentScore = analysis?.atsScore ?? 82;
  const trend = [...atsTrend.slice(0, -1), { week: "Current", score: currentScore }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Progress</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track resume quality, interview readiness, applications, and skill growth.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Current ATS</p><p className="mt-2 text-3xl font-semibold">{currentScore}</p><Badge className="mt-4">+24 since baseline</Badge></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Interview readiness</p><p className="mt-2 text-3xl font-semibold">78%</p><Badge className="mt-4">Technical needs practice</Badge></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Applications sent</p><p className="mt-2 text-3xl font-semibold">17</p><Badge className="mt-4">5 this week</Badge></CardContent></Card>
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
        <CardHeader><CardTitle>Application momentum</CardTitle></CardHeader>
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
