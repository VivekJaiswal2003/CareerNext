import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

const PreferencesSchema = z.object({
  theme: z.enum(["system", "light", "dark"]).default("system"),
  weeklyDigest: z.boolean().default(true),
  applicationReminders: z.boolean().default(true),
  resumeVisibility: z.boolean().default(true)
});

const ProfileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  targetRole: z.string().optional(),
  skills: z.string().optional(),
  interests: z.string().optional(),
  locations: z.string().optional(),
  companies: z.string().optional(),
  graduationYear: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
  preferences: PreferencesSchema.optional()
});

const demoProfile = {
  name: "Anaya Rao",
  email: "anaya@example.com",
  targetRole: "Embedded Software Intern",
  skills: "Embedded C, React, IoT, debugging",
  interests: "EV systems, product engineering, firmware",
  locations: "Bengaluru, Hyderabad, Remote",
  companies: "Bosch, Siemens, Tata Elxsi",
  graduationYear: "2026",
  github: "https://github.com/anaya",
  linkedin: "https://linkedin.com/in/anaya",
  portfolio: "https://anaya.dev",
  preferences: {
    theme: "system",
    weeklyDigest: true,
    applicationReminders: true,
    resumeVisibility: true
  }
};

export async function GET(request: NextRequest) {
  const auth = readAuth(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ profile: { ...demoProfile, email: auth.email, name: auth.name } });

  await connectToDatabase();
  const user = (await User.findById(auth.userId).lean()) as {
    name?: string;
    email?: string;
    targetRole?: string;
    skills?: string[];
    interests?: string;
    preferredLocations?: string;
    preferredCompanies?: string;
    graduationYear?: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
    preferences?: {
      theme?: string;
      weeklyDigest?: boolean;
      applicationReminders?: boolean;
      resumeVisibility?: boolean;
    };
  } | null;
  if (!user) return NextResponse.json({ profile: demoProfile });

  return NextResponse.json({
    profile: {
      name: user.name,
      email: user.email,
      targetRole: user.targetRole || "",
      skills: (user.skills || []).join(", "),
      interests: user.interests || "",
      locations: user.preferredLocations || "",
      companies: user.preferredCompanies || "",
      graduationYear: user.graduationYear || "",
      github: user.github || "",
      linkedin: user.linkedin || "",
      portfolio: user.portfolio || "",
      preferences: {
        theme: user.preferences?.theme || "system",
        weeklyDigest: user.preferences?.weeklyDigest ?? true,
        applicationReminders: user.preferences?.applicationReminders ?? true,
        resumeVisibility: user.preferences?.resumeVisibility ?? true
      }
    }
  });
}

export async function PUT(request: NextRequest) {
  const auth = readAuth(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = ProfileSchema.parse(await request.json());
  if (!process.env.MONGODB_URI) return NextResponse.json({ profile });

  await connectToDatabase();
  await User.findByIdAndUpdate(auth.userId, {
    name: profile.name,
    email: profile.email,
    targetRole: profile.targetRole,
    skills: profile.skills?.split(",").map((item) => item.trim()).filter(Boolean) || [],
    interests: profile.interests,
    preferredLocations: profile.locations,
    preferredCompanies: profile.companies,
    graduationYear: profile.graduationYear,
    github: profile.github,
    linkedin: profile.linkedin,
    portfolio: profile.portfolio,
    preferences: profile.preferences
  });

  return NextResponse.json({ profile });
}
