import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  activeChallenges: mongoose.Types.ObjectId[];
  completedChallenges: mongoose.Types.ObjectId[];
  auraPoints: number;
  totalCompleted: number;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  activeChallenges: [{ type: Schema.Types.ObjectId, ref: "Challenge" }], // This field should exist
  completedChallenges: [{ type: Schema.Types.ObjectId, ref: "Challenge" }],
  auraPoints: { type: Number, default: 0 },
  totalCompleted: { type: Number, default: 0 },
});

export default mongoose.model<IUser>("User", UserSchema);
