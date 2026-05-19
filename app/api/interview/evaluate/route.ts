import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readAuth } from "@/lib/auth";
import { generateGeminiJson } from "@/lib/gemini";

const BodySchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(10),
  role: z.string().min(2)
});

const fallback = {
  score: 76,
  confidenceScore: 78,
  technicalDepthScore: 74,
  communicationScore: 82,
  feedback: "The answer is structured but needs a clearer result and a concise closing statement.",
  improvements: ["Add one measurable outcome", "Mention tradeoffs", "Close with what you learned"],
  followUps: ["What constraint made this problem difficult?", "How would you improve the solution if you had another week?"]
};

export async function POST(request: NextRequest) {
  const auth = readAuth(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = BodySchema.parse(await request.json());
  const result = await generateGeminiJson<typeof fallback>(
    `Evaluate this interview answer for ${body.role}.\nQuestion: ${body.question}\nAnswer: ${body.answer}`,
    fallback
  );
  return NextResponse.json(result);
}
