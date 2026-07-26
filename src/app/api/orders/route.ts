import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();

    const filter =
      session.role === "vendor"
        ? { vendorId: session.userId }
        : session.role === "admin"
          ? {}
          : { userId: session.userId };

    const orders = await Order.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const body = await req.json();
    const { items, deliveryAddress, paymentMethod, subtotal, delivery, discount, total } =
      body;

    const order = await Order.create({
      userId: session.userId,
      items,
      deliveryAddress,
      paymentMethod: paymentMethod || "cod",
      subtotal,
      delivery: delivery ?? 50,
      discount: discount ?? 0,
      total,
      status: "processing",
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
