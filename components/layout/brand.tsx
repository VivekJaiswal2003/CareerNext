import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-white dark:bg-white dark:text-slate-950">
        <BriefcaseBusiness className="h-4 w-4" />
      </span>
      <span>CareerNext</span>
    </Link>
  );
}
