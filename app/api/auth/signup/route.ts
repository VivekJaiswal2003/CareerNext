import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { hashPassword, setSessionCookie, signToken } from "@/lib/auth";
import { User } from "@/models/User";

const SignupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  const body = SignupSchema.parse(await request.json());
  if (!process.env.MONGODB_URI) {
    const token = signToken({ userId: "local-session-user", email: body.email, name: body.name });
    setSessionCookie(token);
    return NextResponse.json({ user: { id: "local-session-user", name: body.name, email: body.email } }, { status: 201 });
  }

  await connectToDatabase();

  const existing = await User.findOne({ email: body.email });
  if (existing) {
    return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 });
  }

  const user = await User.create({
    name: body.name,
    email: body.email,
    passwordHash: await hashPassword(body.password)
  });

  const token = signToken({ userId: user._id.toString(), email: user.email, name: user.name });
  setSessionCookie(token);
  return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email } }, { status: 201 });
}
