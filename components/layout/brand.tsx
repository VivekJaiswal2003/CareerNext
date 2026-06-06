import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight text-sm">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/90 to-accent/80 text-white shadow-sm">
        <BriefcaseBusiness className="h-4 w-4" />
      </span>
      <div className="leading-tight">
        <div className="text-sm font-semibold">CareerNext</div>
        <div className="text-[11px] text-muted-foreground">Career tools for students</div>
      </div>
    </Link>
  );
}
