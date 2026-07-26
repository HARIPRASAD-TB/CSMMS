import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Booking } from "@/models/Booking";
import { getSession } from "@/lib/auth";

/** Customer activity: orders placed and bookings made by the logged-in user (all roles). */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [orders, bookings] = await Promise.all([
      Order.find({ userId: session.userId })
        .sort({ createdAt: -1 })
        .lean(),
      Booking.find({ userId: session.userId })
        .populate("providerId", "title type workerType")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    return NextResponse.json({
      orders: orders.map((o) => ({
        ...o,
        _id: o._id.toString(),
        userId: o.userId.toString(),
      })),
      bookings: bookings.map((b) => ({
        ...b,
        _id: b._id.toString(),
        userId: b.userId.toString(),
        providerId: b.providerId,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
