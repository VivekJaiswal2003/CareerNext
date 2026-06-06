import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { generateGeminiJson } from "@/lib/gemini";
import { Recommendation } from "@/models/Recommendation";

const BodySchema = z.object({
  skills: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  preferredRole: z.string().min(2)
});

const fallback = {
  roles: ["Software Engineering Intern", "Product Engineering Intern"],
  companies: ["Bosch", "Siemens", "Tata Elxsi"],
  missingSkills: ["CAN protocol", "Testing workflow"],
  roadmap: [{ title: "Strengthen embedded fundamentals", timeframe: "2 weeks", tasks: ["Review interrupts", "Practice C memory questions"] }],
  advice: ["Apply to smaller product teams alongside large companies."]
};

export async function POST(request: NextRequest) {
  const auth = readAuth(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = BodySchema.parse(await request.json());
  const result = await generateGeminiJson<typeof fallback>(
    `Recommend internships, companies, missing skills, and a learning roadmap for skills ${body.skills.join(", ")} interests ${body.interests.join(", ")} target role ${body.preferredRole}.`,
    fallback
  );
  if (process.env.MONGODB_URI) {
    await connectToDatabase();
    await Recommendation.create({ userId: auth.userId, ...body, ...result });
  }
  return NextResponse.json(result);
}
