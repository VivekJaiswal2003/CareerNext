import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "student" },
    university: String,
    targetRole: String,
    skills: [String],
    interests: String,
    preferredLocations: String,
    preferredCompanies: String,
    graduationYear: String,
    github: String,
    linkedin: String,
    portfolio: String,
    preferences: {
      theme: { type: String, default: "system" },
      weeklyDigest: { type: Boolean, default: true },
      applicationReminders: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model("User", UserSchema);
