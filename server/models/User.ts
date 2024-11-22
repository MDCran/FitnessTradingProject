import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  activeChallenges: mongoose.Types.ObjectId[];
  completedChallenges: {
    challengeID: mongoose.Types.ObjectId;
    completedAt: Date;
    challengeType: "daily" | "weekly";
  }[];
  auraPoints: number;
  totalCompleted: number;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  activeChallenges: [{ type: Schema.Types.ObjectId, ref: "Challenge" }],
  completedChallenges: [
    {
      challengeID: { type: Schema.Types.ObjectId, ref: "Challenge" },
      completedAt: { type: Date },
      challengeType: { type: String, enum: ["daily", "weekly"] },
    },
  ],
  auraPoints: { type: Number, default: 0 },
  totalCompleted: { type: Number, default: 0 },
});

export default mongoose.model<IUser>("User", UserSchema);
