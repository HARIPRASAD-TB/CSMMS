import mongoose, { Schema, Document, Model } from "mongoose";
import type { UserRole } from "@/lib/auth";

export interface IUser extends Document {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: UserRole;
  address?: string;
  avatar?: string;
  isBlocked: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "worker", "contractor", "vendor", "admin"],
      default: "user",
    },
    address: String,
    avatar: String,
    isBlocked: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
