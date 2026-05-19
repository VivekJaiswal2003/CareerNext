export type ApplicationStatus = "Applied" | "Interview Scheduled" | "Rejected" | "Offer Received";

export type ResumeAnalysisReport = {
  atsScore: number;
  summary: string;
  strengths: string[];
  missingSkills: string[];
  recommendations: string[];
  keywords: string[];
};
