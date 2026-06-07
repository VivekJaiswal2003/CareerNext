"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const progressItems = [
  "Review one resume section at a time to keep edits focused.",
  "Practice a short technical answer before each interview session.",
  "Track application statuses and next steps in the same workspace.",
  "Build one measurable outcome per project bullet for recruiter clarity."
];

export function ProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Focus on steady improvements across resume updates, interview practice, and application follow-up.</p>
        <div className="space-y-3">
          {progressItems.map((item) => (
            <div key={item} className="rounded-2xl border bg-background p-4">
              <p className="text-sm leading-6">{item}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
