import mongoose, { Document, Schema } from "mongoose";

export interface IChallenge extends Document {
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  reward: number;
  createdAt: Date;
}

const ChallengeSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reward: { type: Number, default: 10 }, // Default reward in aura points
  createdAt: { type: Date, default: Date.now }, // Track creation date
});

export default mongoose.model<IChallenge>("Challenge", ChallengeSchema);
