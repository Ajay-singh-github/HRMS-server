import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      default: "New",
    },
    resume: {
      type: String,
      required: true,
    },
    declarationAccepted: {
      type: Boolean,
      default: false,
    },
    attendanceStatus: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Absent",
    },
    createdAt: { type: Date, immutable: false, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Candidate", candidateSchema);
