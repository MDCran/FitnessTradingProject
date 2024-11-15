// server/models/User.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IChallenge extends Document {
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
}

const ChallengeSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<IChallenge>("Challenge", ChallengeSchema);
