import type { ResumeAnalysisReport } from "@/types";

export type DetailedResumeAnalysis = ResumeAnalysisReport & {
  weaknesses: string[];
  improvementSuggestions: string[];
  projectQuality: {
    score: number;
    notes: string;
  };
  roleFit: {
    role: string;
    score: number;
    analysis: string;
  };
};

export const resumeAnalysisFallback: DetailedResumeAnalysis = {
  atsScore: 82,
  summary: "The resume is internship-ready, with strong technical signals and a few gaps around measurable outcomes and role-specific keywords.",
  strengths: [
    "Relevant embedded systems and product project experience",
    "Clear academic foundation for ECE-oriented internships",
    "Good mix of technical skills and practical implementation"
  ],
  missingSkills: ["CAN protocol", "Unit testing", "RTOS basics", "Quantified impact"],
  recommendations: [
    "Add one metric to each project, such as latency reduced, accuracy improved, or users supported.",
    "Move the strongest technical stack into the top third of the resume.",
    "Mirror keywords from target internships when applying to firmware or validation roles."
  ],
  keywords: ["Embedded C", "Firmware", "Debugging", "UART", "SPI", "Testing"],
  weaknesses: [
    "Project descriptions focus on implementation more than outcomes.",
    "Some skills are listed without evidence in project bullets.",
    "Leadership and collaboration signals could be more specific."
  ],
  improvementSuggestions: [
    "Rewrite project bullets using action, method, and measurable result.",
    "Add a compact coursework line only when it supports the target role.",
    "Create a separate version for software-heavy internships and ECE-heavy internships."
  ],
  projectQuality: {
    score: 78,
    notes: "Projects are relevant and practical. The next improvement is adding constraints, tradeoffs, and results."
  },
  roleFit: {
    role: "Target Internship Role",
    score: 84,
    analysis: "Strong fit for embedded and hardware-adjacent internships; add testing and communication protocol evidence to improve match quality."
  }
};

function safeString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function safeNumber(value: unknown, fallback: number) {
  return typeof value === "number" && !Number.isNaN(value) ? value : fallback;
}

function safeArray(value: unknown, fallback: string[]) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : fallback;
}

export function normalizeAnalysis(analysis?: Partial<DetailedResumeAnalysis> | null): DetailedResumeAnalysis {
  if (!analysis) return resumeAnalysisFallback;

  return {
    atsScore: safeNumber(analysis.atsScore, resumeAnalysisFallback.atsScore),
    summary: safeString(analysis.summary, resumeAnalysisFallback.summary),
    strengths: safeArray(analysis.strengths, resumeAnalysisFallback.strengths),
    missingSkills: safeArray(analysis.missingSkills, resumeAnalysisFallback.missingSkills),
    recommendations: safeArray(analysis.recommendations, resumeAnalysisFallback.recommendations),
    keywords: safeArray(analysis.keywords, resumeAnalysisFallback.keywords),
    weaknesses: safeArray(analysis.weaknesses, resumeAnalysisFallback.weaknesses),
    improvementSuggestions: safeArray(analysis.improvementSuggestions, resumeAnalysisFallback.improvementSuggestions),
    projectQuality: {
      score: safeNumber(analysis.projectQuality?.score, resumeAnalysisFallback.projectQuality.score),
      notes: safeString(analysis.projectQuality?.notes, resumeAnalysisFallback.projectQuality.notes)
    },
    roleFit: {
      role: safeString(analysis.roleFit?.role, resumeAnalysisFallback.roleFit.role),
      score: safeNumber(analysis.roleFit?.score, resumeAnalysisFallback.roleFit.score),
      analysis: safeString(analysis.roleFit?.analysis, resumeAnalysisFallback.roleFit.analysis)
    }
  };
}

const skillPatterns = [
  "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "MongoDB", "SQL", "Python", "Java",
  "C++", "C", "Embedded C", "Firmware", "IoT", "UART", "SPI", "I2C", "CAN", "RTOS", "Git",
  "Docker", "AWS", "Google Cloud", "Testing", "Unit testing", "REST", "Data structures"
];

export function extractReadableText(buffer: Buffer, filename: string) {
  const rough = buffer
    .toString("utf8")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (rough.length > 120) return rough.slice(0, 12000);
  return `Uploaded resume file ${filename}. The binary document could not be fully text-extracted, so analyze using file metadata and common student internship resume expectations.`;
}

export function analyzeResumeLocally(text: string, targetRole = "Software Engineering Intern"): DetailedResumeAnalysis {
  const normalized = text.toLowerCase();
  const skills = skillPatterns.filter((skill) => normalized.includes(skill.toLowerCase()));
  const hasProjects = /project|built|developed|implemented|designed|prototype/.test(normalized);
  const hasEducation = /education|university|college|b\.?tech|bachelor|degree|cgpa|gpa/.test(normalized);
  const hasExperience = /intern|experience|worked|volunteer|freelance|research/.test(normalized);
  const hasMetrics = /\b\d+%|\b\d+\s*(users|ms|seconds|hours|students|requests|modules|projects)\b/.test(normalized);
  const hasTesting = /test|testing|unit|qa|validation|debug/.test(normalized);
  const hasLinks = /github|linkedin|portfolio|https?:\/\//.test(normalized);

  const roleKeywords = targetRole.toLowerCase().includes("embedded")
    ? ["Embedded C", "Firmware", "UART", "SPI", "CAN", "RTOS", "Debugging", "Testing"]
    : ["TypeScript", "React", "REST", "Testing", "Git", "MongoDB", "Data structures", "Deployment"];
  const missingSkills = roleKeywords.filter((keyword) => !normalized.includes(keyword.toLowerCase()));

  let score = 46;
  score += Math.min(skills.length * 4, 24);
  score += hasProjects ? 12 : 0;
  score += hasEducation ? 8 : 0;
  score += hasExperience ? 8 : 0;
  score += hasMetrics ? 8 : 0;
  score += hasTesting ? 6 : 0;
  score += hasLinks ? 4 : 0;
  score -= Math.min(missingSkills.length * 3, 18);
  const atsScore = Math.max(38, Math.min(94, score));

  const strengths = [
    hasProjects ? "Project work is visible and gives recruiters evidence to inspect." : "The resume has enough structure to begin targeted improvements.",
    skills.length > 3 ? `Relevant skills detected: ${skills.slice(0, 5).join(", ")}.` : "The profile can become stronger by tying listed skills to project evidence.",
    hasEducation ? "Education details are present and support early-career screening." : "Adding education details will improve student-role screening."
  ];

  const weaknesses = [
    hasMetrics ? "Metrics are present, but each major project should still carry one clear outcome." : "Project bullets need measurable outcomes rather than only implementation details.",
    hasTesting ? "Testing/debugging appears, but it should be connected to a concrete result." : "Testing, validation, or debugging evidence is missing or too subtle.",
    missingSkills.length ? `Role keyword gaps: ${missingSkills.slice(0, 4).join(", ")}.` : "The keyword base is strong; the next gap is sharper prioritization."
  ];

  return {
    atsScore,
    summary: `This resume currently reads as ${atsScore >= 80 ? "strong" : atsScore >= 65 ? "promising but uneven" : "early-stage"} for ${targetRole}. The highest-leverage improvements are clearer project outcomes, stronger role keywords, and recruiter-readable evidence.`,
    strengths,
    missingSkills,
    recommendations: [
      "Rewrite the top two projects using action, technical method, and measurable result.",
      `Add truthful keywords for ${targetRole}: ${missingSkills.slice(0, 5).join(", ") || "role-specific tools and outcomes"}.`,
      "Keep the strongest skills and most relevant project in the top third of the resume."
    ],
    keywords: skills.length ? skills : roleKeywords.slice(0, 5),
    weaknesses,
    improvementSuggestions: [
      hasMetrics ? "Move the strongest metric closer to the project title." : "Add one number to each important project, such as latency, users, modules, accuracy, or time saved.",
      hasLinks ? "Make sure GitHub or portfolio links point directly to polished project evidence." : "Add GitHub, LinkedIn, or portfolio links for recruiter verification.",
      "Create a tailored version for each role family instead of one universal resume."
    ],
    projectQuality: {
      score: Math.max(45, Math.min(92, atsScore + (hasProjects ? 2 : -10))),
      notes: hasProjects
        ? "Projects are present; improve them by showing constraints, tradeoffs, and outcomes."
        : "Projects need to be more visible. Add 2-3 compact project entries with stack, role, and result."
    },
    roleFit: {
      role: targetRole,
      score: Math.max(42, Math.min(93, atsScore + (missingSkills.length <= 2 ? 6 : -4))),
      analysis: missingSkills.length
        ? `Good foundation for ${targetRole}, but recruiters may look for ${missingSkills.slice(0, 3).join(", ")}.`
        : `Strong keyword and evidence fit for ${targetRole}; focus next on concision and proof.`
    }
  };
}
