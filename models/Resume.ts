import mongoose, { Schema, models } from "mongoose";

const ResumeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    extractedText: { type: String, default: "" },
    source: { type: String, enum: ["upload", "paste"], default: "upload" }
  },
  { timestamps: true }
);

export const Resume = models.Resume || mongoose.model("Resume", ResumeSchema);
