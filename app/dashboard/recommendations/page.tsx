"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast-provider";

type RoadmapItem = { title: string; timeframe: string; tasks: string[] };
type RecommendationResult = {
  roles: string[];
  companies: string[];
  missingSkills: string[];
  roadmap: RoadmapItem[];
  advice: string[];
};

function normalizeRecommendationResult(payload: any): RecommendationResult {
  return {
    roles: Array.isArray(payload?.roles) ? payload.roles.filter((item: unknown): item is string => typeof item === "string") : initialResult.roles,
    companies: Array.isArray(payload?.companies) ? payload.companies.filter((item: unknown): item is string => typeof item === "string") : initialResult.companies,
    missingSkills: Array.isArray(payload?.missingSkills) ? payload.missingSkills.filter((item: unknown): item is string => typeof item === "string") : initialResult.missingSkills,
    roadmap: Array.isArray(payload?.roadmap)
      ? payload.roadmap.map((item: any) => ({
          title: typeof item?.title === "string" ? item.title : "Build stronger project evidence",
          timeframe: typeof item?.timeframe === "string" ? item.timeframe : "2 weeks",
          tasks: Array.isArray(item?.tasks) ? item.tasks.filter((task: unknown): task is string => typeof task === "string") : []
        }))
      : initialResult.roadmap,
    advice: Array.isArray(payload?.advice) ? payload.advice.filter((item: unknown): item is string => typeof item === "string") : initialResult.advice
  };
}

const initialResult: RecommendationResult = {
  roles: ["Embedded Software Intern", "Hardware Validation Intern", "IoT Product Engineering Intern"],
  companies: ["Bosch", "Siemens", "Tata Elxsi", "NovaGrid"],
  missingSkills: ["CAN protocol", "RTOS basics", "Test automation"],
  roadmap: [
    { title: "Strengthen embedded fundamentals", timeframe: "2 weeks", tasks: ["Review interrupts and timers", "Practice memory questions", "Document one debugging story"] },
    { title: "Build application evidence", timeframe: "3 weeks", tasks: ["Add sensor dashboard metrics", "Write a compact project README", "Apply to 8 targeted internships"] }
  ],
  advice: ["Use a slightly different resume version for firmware and validation roles.", "Prioritize companies where hardware and software teams work closely."]
};

export default function RecommendationsPage() {
  const { toast } = useToast();
  const [skills, setSkills] = useState("C++, embedded systems, React");
  const [interests, setInterests] = useState("EV, IoT, product engineering");
  const [preferredRole, setPreferredRole] = useState("Hardware software intern");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(initialResult);

  async function generate() {
    setLoading(true);
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: skills.split(",").map((item) => item.trim()).filter(Boolean),
          interests: interests.split(",").map((item) => item.trim()).filter(Boolean),
          preferredRole
        })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not generate recommendations");
      setResult(normalizeRecommendationResult(payload));
      toast({ title: "Recommendations updated", description: "Role matches and roadmap are refreshed." });
    } catch (error) {
      toast({ variant: "error", title: "Recommendations failed", description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Recommendations</h1>
        <p className="mt-1 text-sm text-muted-foreground">Generate role, company, skill-gap, and roadmap suggestions from your current direction.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader><CardTitle>Profile signal</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="Skills: C++, React, embedded systems" />
            <Input value={interests} onChange={(event) => setInterests(event.target.value)} placeholder="Interests: EV, IoT, product engineering" />
            <Input value={preferredRole} onChange={(event) => setPreferredRole(event.target.value)} placeholder="Preferred role" />
            <Button onClick={generate} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate roadmap
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Personalized plan</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-semibold">Recommended roles</p>
              <div className="mt-2 flex flex-wrap gap-2">{result.roles.map((role) => <Badge key={role}>{role}</Badge>)}</div>
            </div>
            <div>
              <p className="text-sm font-semibold">Suggested companies</p>
              <div className="mt-2 flex flex-wrap gap-2">{result.companies.map((company) => <Badge key={company}>{company}</Badge>)}</div>
            </div>
            <div>
              <p className="text-sm font-semibold">Skill gaps</p>
              <div className="mt-2 flex flex-wrap gap-2">{result.missingSkills.map((skill) => <Badge key={skill}>{skill}</Badge>)}</div>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold">Learning roadmap</p>
              {result.roadmap.map((item) => (
                <div key={item.title} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{item.title}</p>
                    <span className="text-xs text-muted-foreground">{item.timeframe}</span>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {item.tasks.map((task) => <li key={task}>• {task}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
