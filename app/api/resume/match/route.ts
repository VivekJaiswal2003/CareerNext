import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readAuth } from "@/lib/auth";
import { generateGeminiJson } from "@/lib/gemini";

const BodySchema = z.object({
  jobDescription: z.string().min(30),
  resumeSummary: z.string().default("")
});

const fallback = {
  compatibility: 73,
  missingSkills: ["CI/CD exposure", "REST API testing", "Production monitoring"],
  keywordGaps: ["unit tests", "agile delivery", "observability"],
  recruiterRisks: [
    "Resume project bullets do not yet show production constraints.",
    "Some job keywords appear only in the skills section, not in evidence."
  ],
  improvementPlan: [
    "Add a project bullet that mentions testing, deployment, or reliability.",
    "Mirror 5-7 exact job description keywords where they are truthful.",
    "Move the most relevant project above older academic work."
  ]
};

export async function POST(request: NextRequest) {
  const auth = readAuth(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = BodySchema.parse(await request.json());
  const result = await generateGeminiJson<typeof fallback>(
    `Compare this job description to the student's resume context. Return compatibility, missingSkills, keywordGaps, recruiterRisks, and improvementPlan.\n\nJD:\n${body.jobDescription}\n\nResume context:\n${body.resumeSummary}`,
    fallback
  );

  return NextResponse.json(result);
}
