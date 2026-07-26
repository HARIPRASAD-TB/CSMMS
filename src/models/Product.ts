import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  vendorId: mongoose.Types.ObjectId;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  image: string;
  features: string[];
  rating: number;
  reviewCount: number;
  isApproved: boolean;
}

const ProductSchema = new Schema<IProduct>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    unit: { type: String, default: "unit" },
    stock: { type: Number, default: 0 },
    image: String,
    features: [String],
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
