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
  try {
    const auth = readAuth(request);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file");
    const targetRole = String(formData.get("targetRole") || "Software Engineering Intern");

    // Accept web File or form-like object with arrayBuffer() (server runtimes may provide different File implementations)
    if (!file || (!((file as any) instanceof File) && typeof (file as any).arrayBuffer !== "function")) {
      return NextResponse.json({ error: "Resume file is required." }, { status: 400 });
    }

    // Normalize file-like properties safely across runtimes
    const fileName = (file as any)?.name || "upload";
    const fileType = (file as any)?.type || "";
    const fileSize = typeof (file as any)?.size === "number" ? (file as any).size : undefined;

    // Validate file size (limit to 8MB for serverless safety)
    const MAX_BYTES = Number(process.env.MAX_UPLOAD_BYTES || 8 * 1024 * 1024);
    if (typeof fileSize === "number" && fileSize > MAX_BYTES) {
      return NextResponse.json({ error: `File too large (max ${Math.round(MAX_BYTES / 1024 / 1024)} MB).` }, { status: 413 });
    }

    const extension = path.extname(fileName).toLowerCase();
    const isAcceptedExtension = extension === ".pdf" || extension === ".docx" || extension === ".doc";
    if (!acceptedTypes.has(fileType) && !isAcceptedExtension) {
      return NextResponse.json({ error: "Please upload a PDF or DOCX resume." }, { status: 415 });
    }

    // Read file buffer safely
    let buffer: Buffer;
    try {
      buffer = Buffer.from(await (file as any).arrayBuffer());
    } catch (err) {
      return NextResponse.json({ error: "Could not read uploaded file." }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const diskPath = path.join(uploadDir, safeName);
    try {
      await writeFile(diskPath, buffer);
    } catch (err) {
      console.warn("Upload write failed");
      // continue; we still return analysis even if disk write failed in some environments
    }

   const extractedText = await extractReadableText(buffer, (file as File).name);
    const localAnalysis = analyzeResumeLocally(extractedText, targetRole);

    // Call Gemini with robust try/catch and rely on generateGeminiJson's fallback behavior
    let report: DetailedResumeAnalysis;
    try {
      report = await generateGeminiJson<DetailedResumeAnalysis>(
        `Analyze this resume for a student targeting ${targetRole}. Include ATS score, missing keywords, strengths, weaknesses, improvement suggestions, project quality score/notes, and role fit score/analysis.\n\nResume text:\n${extractedText}`,
        localAnalysis
      );
    } catch (err) {
      console.warn("Gemini fallback used");
      report = localAnalysis;
    }

    const analysis = normalizeAnalysis(report);

    if (process.env.MONGODB_URI) {
      try {
        await connectToDatabase();
        const resume = await Resume.create({
          userId: auth.userId,
          fileName,
          fileType: fileType || extension,
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
      } catch (err) {
        console.warn("Resume DB persist failed");
      }
    }

    return NextResponse.json({
      file: {
        name: fileName,
        size: typeof fileSize === "number" ? fileSize : buffer.length,
        url: `/uploads/${safeName}`
      },
      analysis
    });
  } catch (err) {
    console.warn("/api/resume/upload error: handled");
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
