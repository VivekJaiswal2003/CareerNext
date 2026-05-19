import mongoose, { Schema, models } from "mongoose";

const RecommendationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    skills: [String],
    interests: [String],
    preferredRole: String,
    roles: [String],
    companies: [String],
    missingSkills: [String],
    roadmap: [
      {
        title: String,
        timeframe: String,
        tasks: [String]
      }
    ],
    advice: [String]
  },
  { timestamps: true }
);

export const Recommendation =
  models.Recommendation || mongoose.model("Recommendation", RecommendationSchema);
