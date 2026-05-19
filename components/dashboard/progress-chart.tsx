"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { week: "W1", score: 54 },
  { week: "W2", score: 61 },
  { week: "W3", score: 68 },
  { week: "W4", score: 72 },
  { week: "W5", score: 78 },
  { week: "W6", score: 83 }
];

export function ProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly progress</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="week" axisLine={false} tickLine={false} />
            <YAxis hide domain={[40, 100]} />
            <Tooltip />
            <Area type="monotone" dataKey="score" stroke="#2f5f99" fill="#dbeafe" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
