import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activity = [
  "Resume score improved after adding project metrics",
  "Mock technical interview completed for Embedded Systems Intern",
  "Application moved to Interview Scheduled at NovaGrid",
  "Roadmap updated with DSA revision block"
];

export function ActivityList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activity.map((item, index) => (
            <div key={item} className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <div>
                <p className="text-sm">{item}</p>
                <p className="mt-1 text-xs text-muted-foreground">{index + 1} day{index ? "s" : ""} ago</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
