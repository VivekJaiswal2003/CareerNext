import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Application } from "@/models/Application";

const BodySchema = z.object({
  company: z.string().min(2),
  role: z.string().min(2),
  location: z.string().optional(),
  status: z.enum(["Applied", "Interview Scheduled", "Rejected", "Offer Received"]).default("Applied"),
  source: z.string().optional(),
  interviewDate: z.string().optional(),
  nextStep: z.string().optional(),
  notes: z.string().optional()
});

export async function GET(request: NextRequest) {
  const auth = readAuth(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ applications: [] });
  await connectToDatabase();
  const applications = await Application.find({ userId: auth.userId }).sort({ updatedAt: -1 }).lean();
  return NextResponse.json({ applications });
}

export async function POST(request: NextRequest) {
  const auth = readAuth(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = BodySchema.parse(await request.json());
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ application: { _id: crypto.randomUUID(), userId: auth.userId, ...body, appliedAt: new Date() } }, { status: 201 });
  }
  await connectToDatabase();
  const application = await Application.create({ userId: auth.userId, ...body, appliedAt: new Date() });
  return NextResponse.json({ application }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const auth = readAuth(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = z.object({
    id: z.string(),
    status: z.enum(["Applied", "Interview Scheduled", "Rejected", "Offer Received"]).optional(),
    notes: z.string().optional(),
    interviewDate: z.string().optional(),
    nextStep: z.string().optional()
  }).parse(await request.json());

  if (!process.env.MONGODB_URI) return NextResponse.json({ application: body });

  await connectToDatabase();
  const application = await Application.findOneAndUpdate(
    { _id: body.id, userId: auth.userId },
    { $set: body },
    { new: true }
  );
  return NextResponse.json({ application });
}
