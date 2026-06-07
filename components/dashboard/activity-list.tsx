import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activity = [
  "Updated project bullets with clearer outcomes",
  "Saved application status and next follow-up step",
  "Reviewed interview practice questions for your target role",
  "Added a focused weekly task for skills and applications"
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
