// server/models/User.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  createdChallenges: mongoose.Types.ObjectId[];
  completedChallenges: string[];
  totalCompleted: number;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdChallenges: { type: [mongoose.Schema.Types.ObjectId], ref:"Challenge", default: [] },
  completedChallenges: { type: [String], default: [] },
  totalCompleted: { type: Number, default: 0 },
});

export default mongoose.model<IUser>("User", UserSchema);
