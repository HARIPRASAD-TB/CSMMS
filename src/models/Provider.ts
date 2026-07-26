import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProvider extends Document {
  userId: mongoose.Types.ObjectId;
  type: "worker" | "contractor";
  title: string;
  description: string;
  location: string;
  workerType?: string;
  pricePerDay?: number;
  pricePerSqFt?: number;
  experience: number;
  completedProjects: number;
  rating: number;
  reviewCount: number;
  portfolio: string[];
  services: {
    name: string;
    pricePerSqFt?: number;
    description?: string;
  }[];
  isVerified: boolean;
  isApproved: boolean;
}

const ProviderSchema = new Schema<IProvider>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["worker", "contractor"], required: true },
    title: { type: String, required: true },
    description: String,
    location: { type: String, required: true },
    workerType: String,
    pricePerDay: Number,
    pricePerSqFt: Number,
    experience: { type: Number, default: 0 },
    completedProjects: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    portfolio: [String],
    services: [
      {
        name: String,
        pricePerSqFt: Number,
        description: String,
      },
    ],
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Provider: Model<IProvider> =
  mongoose.models.Provider ||
  mongoose.model<IProvider>("Provider", ProviderSchema);
