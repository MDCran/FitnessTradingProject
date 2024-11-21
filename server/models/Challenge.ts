import mongoose, { Document, Schema } from "mongoose";

export interface IChallenge extends Document {
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  reward: number;
  createdAt: Date;
  expiresAt: Date;
  challengeType: "daily" | "weekly";
}

const ChallengeSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reward: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: function () {
      return this.challengeType === "daily"
        ? new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day for daily
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week for weekly
    },
  },
  challengeType: {
    type: String,
    enum: ["daily", "weekly"],
    default: "weekly",
  },
});

export default mongoose.model<IChallenge>("Challenge", ChallengeSchema);
