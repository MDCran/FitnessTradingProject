import mongoose, { Document, Schema } from "mongoose";

export interface IChallenge extends Document {
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  reward: number;
  createdAt: Date;
  expiresAt: Date; // Add this property
}

const ChallengeSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reward: { type: Number, default: 10 }, // Default reward in aura points
  createdAt: { type: Date, default: Date.now }, // Track creation date
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires 1 week from creation
  },
});

export default mongoose.model<IChallenge>("Challenge", ChallengeSchema);
