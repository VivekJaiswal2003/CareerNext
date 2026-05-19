import mongoose, { Schema, models } from "mongoose";

const PlannerTaskSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    category: { type: String, default: "career" },
    weekOf: { type: String, required: true },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const PlannerTask = models.PlannerTask || mongoose.model("PlannerTask", PlannerTaskSchema);
