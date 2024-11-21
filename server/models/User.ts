import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  createdChallenges: mongoose.Types.ObjectId[];
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
  createdChallenges: [{ type: Schema.Types.ObjectId, ref: "Challenge" }],
  activeChallenges: [{ type: Schema.Types.ObjectId, ref: "Challenge" }], // Challenges user is attempting
  completedChallenges: [{ type: Schema.Types.ObjectId, ref: "Challenge" }], // Challenges user completed
  auraPoints: { type: Number, default: 0 }, // Currency system
  totalCompleted: { type: Number, default: 0 }, // Total challenges completed
});

export default mongoose.model<IUser>("User", UserSchema);
