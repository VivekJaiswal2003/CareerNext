import mongoose, { Schema, models } from "mongoose";

const ResumeAnalysisSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resumeId: { type: Schema.Types.ObjectId, ref: "Resume" },
    atsScore: { type: Number, min: 0, max: 100, required: true },
    summary: String,
    strengths: [String],
    weaknesses: [String],
    missingSkills: [String],
    recommendations: [String],
    keywords: [String],
    improvementSuggestions: [String],
    projectQuality: {
      score: Number,
      notes: String
    },
    roleFit: {
      role: String,
      score: Number,
      analysis: String
    }
  },
  { timestamps: true }
);

export const ResumeAnalysis =
  models.ResumeAnalysis || mongoose.model("ResumeAnalysis", ResumeAnalysisSchema);
