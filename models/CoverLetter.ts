import mongoose, { Schema, models } from "mongoose";

const CoverLetterSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    tone: { type: String, default: "professional" },
    content: { type: String, required: true },
    jobDescription: String
  },
  { timestamps: true }
);

export const CoverLetter = models.CoverLetter || mongoose.model("CoverLetter", CoverLetterSchema);
