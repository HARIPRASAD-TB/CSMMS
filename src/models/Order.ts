import mongoose, { Schema, Document, Model } from "mongoose";

export type OrderStatus =
  | "processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  vendorId?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  deliveryAddress: string;
  paymentMethod: string;
  status: OrderStatus;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    subtotal: Number,
    delivery: { type: Number, default: 50 },
    discount: { type: Number, default: 0 },
    total: Number,
    deliveryAddress: String,
    paymentMethod: { type: String, default: "cod" },
    status: {
      type: String,
      enum: ["processing", "packed", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
