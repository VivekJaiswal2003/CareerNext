import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon
}: {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          </div>
          <span className="rounded-md bg-muted p-2 text-muted-foreground">
            <Icon className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
