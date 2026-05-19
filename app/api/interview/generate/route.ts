import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { generateGeminiJson } from "@/lib/gemini";
import { InterviewSession } from "@/models/InterviewSession";

const BodySchema = z.object({
  role: z.string().min(2),
  mode: z.enum(["hr", "technical", "ece", "mock"]).default("technical")
});

const fallback = {
  questions: [
    { question: "Tell me about a project where you debugged a difficult issue.", focus: "Project ownership", difficulty: "medium" },
    { question: "Explain interrupt handling in embedded systems.", focus: "ECE fundamentals", difficulty: "medium" },
    { question: "Why does this internship fit your current goals?", focus: "Motivation", difficulty: "easy" }
  ]
};

export async function POST(request: NextRequest) {
  const auth = readAuth(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = BodySchema.parse(await request.json());

  const result = await generateGeminiJson<typeof fallback>(
    `Generate 8 ${body.mode} interview questions for a student applying to ${body.role}. Include focus and difficulty.`,
    fallback
  );

  if (process.env.MONGODB_URI) {
    await connectToDatabase();
    await InterviewSession.create({ userId: auth.userId, role: body.role, mode: body.mode, questions: result.questions });
  }
  return NextResponse.json(result);
}
