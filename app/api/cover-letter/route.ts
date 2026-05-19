import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { generateGeminiJson } from "@/lib/gemini";
import { CoverLetter } from "@/models/CoverLetter";

const BodySchema = z.object({
  company: z.string().min(2),
  role: z.string().min(2),
  jobDescription: z.string().default(""),
  profileSummary: z.string().default("Student or early professional seeking an internship."),
  tone: z.string().default("professional")
});

const fallback = {
  content: "Dear Hiring Team,\n\nI am excited to apply for this role because it connects directly with my current technical work and career goals. My projects have helped me build practical problem-solving habits, and I would value the opportunity to contribute while learning from your team.\n\nSincerely,"
};

export async function POST(request: NextRequest) {
  const auth = readAuth(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = BodySchema.parse(await request.json());
  const result = await generateGeminiJson<typeof fallback>(
    `Write a concise tailored cover letter for ${body.role} at ${body.company}. Tone: ${body.tone}. Profile: ${body.profileSummary}. Job description: ${body.jobDescription}`,
    fallback
  );
  if (process.env.MONGODB_URI) {
    await connectToDatabase();
    await CoverLetter.create({ userId: auth.userId, ...body, content: result.content });
  }
  return NextResponse.json(result);
}
