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
    <Card className="transition hover:-translate-y-0.5 hover:shadow-soft">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
