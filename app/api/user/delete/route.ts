import { NextRequest, NextResponse } from "next/server";
import { readAuth, clearSessionCookie } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { Application } from "@/models/Application";
import { Resume } from "@/models/Resume";
import { ResumeAnalysis } from "@/models/ResumeAnalysis";
import { Recommendation } from "@/models/Recommendation";
import { PlannerTask } from "@/models/PlannerTask";
import { InterviewSession } from "@/models/InterviewSession";

export async function POST(request: NextRequest) {
  const auth = readAuth(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.MONGODB_URI) {
    clearSessionCookie();
    return NextResponse.json({ ok: true });
  }

  await connectToDatabase();
  await Promise.all([
    User.findByIdAndDelete(auth.userId),
    Application.deleteMany({ userId: auth.userId }),
    Resume.deleteMany({ userId: auth.userId }),
    ResumeAnalysis.deleteMany({ userId: auth.userId }),
    Recommendation.deleteMany({ userId: auth.userId }),
    PlannerTask.deleteMany({ userId: auth.userId }),
    InterviewSession.deleteMany({ userId: auth.userId })
  ]);
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}
