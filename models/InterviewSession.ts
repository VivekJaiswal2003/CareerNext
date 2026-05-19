import mongoose, { Schema, models } from "mongoose";

const InterviewSessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },
    mode: { type: String, enum: ["hr", "technical", "ece", "mock"], default: "technical" },
    questions: [
      {
        question: String,
        focus: String,
        difficulty: String
      }
    ],
    answer: String,
    evaluation: {
      score: Number,
      feedback: String,
      improvements: [String]
    }
  },
  { timestamps: true }
);

export const InterviewSession =
  models.InterviewSession || mongoose.model("InterviewSession", InterviewSessionSchema);
