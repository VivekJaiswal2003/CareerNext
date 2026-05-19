import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { setSessionCookie, signToken, verifyPassword } from "@/lib/auth";
import { User } from "@/models/User";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  const body = LoginSchema.parse(await request.json());
  if (!process.env.MONGODB_URI) {
    const name = body.email.split("@")[0]?.replace(/[._-]/g, " ") || "CareerNext Student";
    const token = signToken({ userId: "local-demo-user", email: body.email, name });
    setSessionCookie(token);
    return NextResponse.json({ user: { id: "local-demo-user", name, email: body.email } });
  }

  await connectToDatabase();

  const user = await User.findOne({ email: body.email });
  if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = signToken({ userId: user._id.toString(), email: user.email, name: user.name });
  setSessionCookie(token);
  return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email } });
}
