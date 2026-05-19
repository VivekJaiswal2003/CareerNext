import { NextRequest, NextResponse } from "next/server";
import { readAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ResumeAnalysis } from "@/models/ResumeAnalysis";
import { normalizeAnalysis, resumeAnalysisFallback } from "@/lib/resume-analysis";

export async function GET(request: NextRequest) {
  const auth = readAuth(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ analysis: null });

  await connectToDatabase();
  const latest = await ResumeAnalysis.findOne({ userId: auth.userId }).sort({ createdAt: -1 }).lean();
  if (!latest) return NextResponse.json({ analysis: null });

  return NextResponse.json({ analysis: normalizeAnalysis(latest as any) });
}
