import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { generateGeminiJson } from "@/lib/gemini";
import { analyzeResumeLocally, normalizeAnalysis, type DetailedResumeAnalysis } from "@/lib/resume-analysis";
import { Resume } from "@/models/Resume";
import { ResumeAnalysis } from "@/models/ResumeAnalysis";

const BodySchema = z.object({
  fileName: z.string().default("pasted-resume.txt"),
  fileType: z.string().default("text/plain"),
  text: z.string().min(20)
});

export async function POST(request: NextRequest) {
  const auth = readAuth(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = BodySchema.parse(await request.json());
  const localAnalysis = analyzeResumeLocally(body.text);
  const report = await generateGeminiJson<DetailedResumeAnalysis>(
    `Analyze this student resume for ATS fit, skill gaps, and internship readiness:\n${body.text}`,
    localAnalysis
  );
  const analysis = normalizeAnalysis(report);

  if (process.env.MONGODB_URI) {
    await connectToDatabase();
    const resume = await Resume.create({
      userId: auth.userId,
      fileName: body.fileName,
      fileType: body.fileType,
      extractedText: body.text,
      source: "paste"
    });
    await ResumeAnalysis.create({
      userId: auth.userId,
      resumeId: resume._id,
      atsScore: analysis.atsScore,
      summary: analysis.summary,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      missingSkills: analysis.missingSkills,
      recommendations: analysis.recommendations,
      keywords: analysis.keywords,
      improvementSuggestions: analysis.improvementSuggestions,
      projectQuality: analysis.projectQuality,
      roleFit: analysis.roleFit
    });
  }

  return NextResponse.json(analysis);
}
