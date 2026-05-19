import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { readAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { generateGeminiJson } from "@/lib/gemini";
import { analyzeResumeLocally, extractReadableText, normalizeAnalysis, type DetailedResumeAnalysis } from "@/lib/resume-analysis";
import { Resume } from "@/models/Resume";
import { ResumeAnalysis } from "@/models/ResumeAnalysis";

const acceptedTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword"
]);

export async function POST(request: NextRequest) {
  const auth = readAuth(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  const targetRole = String(formData.get("targetRole") || "Software Engineering Intern");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Resume file is required." }, { status: 400 });
  }

  const extension = path.extname(file.name).toLowerCase();
  const isAcceptedExtension = extension === ".pdf" || extension === ".docx" || extension === ".doc";
  if (!acceptedTypes.has(file.type) && !isAcceptedExtension) {
    return NextResponse.json({ error: "Please upload a PDF or DOCX resume." }, { status: 415 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const diskPath = path.join(uploadDir, safeName);
  await writeFile(diskPath, buffer);

  const extractedText = extractReadableText(buffer, file.name);
  const localAnalysis = analyzeResumeLocally(extractedText, targetRole);
  const report = await generateGeminiJson<DetailedResumeAnalysis>(
    `Analyze this resume for a student targeting ${targetRole}. Include ATS score, missing keywords, strengths, weaknesses, improvement suggestions, project quality score/notes, and role fit score/analysis.\n\nResume text:\n${extractedText}`,
    localAnalysis
  );
  const analysis = normalizeAnalysis(report);

  if (process.env.MONGODB_URI) {
    await connectToDatabase();
    const resume = await Resume.create({
      userId: auth.userId,
      fileName: file.name,
      fileType: file.type || extension,
      extractedText,
      source: "upload"
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

  return NextResponse.json({
    file: {
      name: file.name,
      size: file.size,
      url: `/uploads/${safeName}`
    },
    analysis
  });
}
