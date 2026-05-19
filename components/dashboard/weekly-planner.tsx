"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast-provider";

const plans = [
  [
    "Rewrite two project bullets with measurable outcomes",
    "Solve 6 array/string interview problems",
    "Practice UART/SPI explanation out loud",
    "Apply to 4 firmware or validation internships",
    "Send one thoughtful follow-up email"
  ],
  [
    "Tailor resume for embedded software roles",
    "Record a 3-minute project walkthrough",
    "Review interrupts, timers, and memory maps",
    "Compare 3 internship JDs for repeated keywords",
    "Update LinkedIn featured project section"
  ]
];

type PlannerTask = {
  id: string;
  title: string;
  completed: boolean;
};

export function WeeklyPlanner() {
  const { toast } = useToast();
  const [version, setVersion] = useState(0);
  const [tasks, setTasks] = useState<PlannerTask[]>(plans[0].map((title, index) => ({ id: `initial-${index}`, title, completed: false })));
  const progress = useMemo(() => Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100), [tasks]);

  useEffect(() => {
    fetch("/api/planner")
      .then((response) => response.json())
      .then((payload) => {
        if (payload.tasks?.length) setTasks(payload.tasks);
      })
      .catch(() => undefined);
  }, []);

  async function regenerate() {
    const next = plans[(version + 1) % plans.length];
    setVersion((current) => current + 1);
    setTasks(next.map((title, index) => ({ id: `local-${Date.now()}-${index}`, title, completed: false })));
    const response = await fetch("/api/planner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks: next })
    });
    const payload = await response.json();
    if (payload.tasks) setTasks(payload.tasks);
    toast({ title: "Weekly plan regenerated", description: "A fresh career sprint is ready." });
  }

  async function toggleTask(task: PlannerTask, completed: boolean) {
    setTasks((current) => current.map((item) => item.id === task.id ? { ...item, completed } : item));
    await fetch("/api/planner", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id, completed })
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Weekly career planner</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Learning goals, interview prep, project milestones, and application reminders.</p>
          </div>
          <Button variant="outline" onClick={regenerate}><RefreshCw className="h-4 w-4" />AI regenerate</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <Badge>{progress}% complete</Badge>
        </div>
        <div className="grid gap-2">
          {tasks.map((task) => {
            const checked = task.completed;
            return (
              <label key={task.id} className="pressable flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm hover:bg-muted/40">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => void toggleTask(task, event.target.checked)}
                  className="h-4 w-4"
                />
                <span className={checked ? "text-muted-foreground line-through" : ""}>{task.title}</span>
              </label>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
