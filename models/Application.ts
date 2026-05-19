import mongoose, { Schema, models } from "mongoose";

const ApplicationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    location: String,
    status: {
      type: String,
      enum: ["Applied", "Interview Scheduled", "Rejected", "Offer Received"],
      default: "Applied"
    },
    source: String,
    appliedAt: Date,
    interviewDate: Date,
    nextStep: String,
    notes: String
  },
  { timestamps: true }
);

export const Application = models.Application || mongoose.model("Application", ApplicationSchema);
