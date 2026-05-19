import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { PlannerTask } from "@/models/PlannerTask";

const weekOf = new Date().toISOString().slice(0, 10);
const defaultTasks = [
  "Rewrite two project bullets with measurable outcomes",
  "Solve 6 array/string interview problems",
  "Practice UART/SPI explanation out loud",
  "Apply to 4 firmware or validation internships",
  "Send one thoughtful follow-up email"
].map((title, index) => ({ id: `demo-${index}`, title, completed: false, category: "career", weekOf }));

export async function GET(request: NextRequest) {
  const auth = readAuth(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ tasks: defaultTasks });

  await connectToDatabase();
  let tasks = await PlannerTask.find({ userId: auth.userId, weekOf }).sort({ createdAt: 1 }).lean();
  if (tasks.length === 0) {
    await PlannerTask.insertMany(defaultTasks.map(({ title, category }) => ({ userId: auth.userId, title, category, weekOf })));
    tasks = await PlannerTask.find({ userId: auth.userId, weekOf }).sort({ createdAt: 1 }).lean();
  }
  return NextResponse.json({ tasks: tasks.map((task) => ({ id: String(task._id), title: task.title, completed: task.completed, category: task.category, weekOf: task.weekOf })) });
}

export async function PATCH(request: NextRequest) {
  const auth = readAuth(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = z.object({ id: z.string(), completed: z.boolean() }).parse(await request.json());
  if (!process.env.MONGODB_URI) return NextResponse.json({ task: body });

  await connectToDatabase();
  const task = await PlannerTask.findOneAndUpdate({ _id: body.id, userId: auth.userId }, { completed: body.completed }, { new: true });
  return NextResponse.json({ task });
}

export async function POST(request: NextRequest) {
  const auth = readAuth(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = z.object({ tasks: z.array(z.string()).min(1) }).parse(await request.json());
  if (!process.env.MONGODB_URI) return NextResponse.json({ tasks: body.tasks.map((title, index) => ({ id: `regen-${Date.now()}-${index}`, title, completed: false, category: "career", weekOf })) });

  await connectToDatabase();
  await PlannerTask.deleteMany({ userId: auth.userId, weekOf });
  const created = await PlannerTask.insertMany(body.tasks.map((title) => ({ userId: auth.userId, title, category: "career", weekOf })));
  return NextResponse.json({ tasks: created.map((task) => ({ id: task._id.toString(), title: task.title, completed: task.completed, category: task.category, weekOf: task.weekOf })) });
}
