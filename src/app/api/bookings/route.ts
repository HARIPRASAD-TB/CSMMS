import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { Provider } from "@/models/Provider";
import { getSession, getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const session = token ? verifyToken(token) : await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const status = req.nextUrl.searchParams.get("status");

    let filter: Record<string, unknown> = {};
    if (session.role === "user") {
      filter.userId = session.userId;
    } else if (["worker", "contractor"].includes(session.role)) {
      const provider = await Provider.findOne({ userId: session.userId });
      if (!provider) return NextResponse.json({ bookings: [] });
      filter.providerId = provider._id;
    } else if (session.role === "admin") {
      filter = {};
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (status && status !== "all") filter.status = status;

    const bookings = await Booking.find(filter)
      .populate("providerId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ bookings });
  } catch (e) {
    console.error(e);
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
    const {
      providerId,
      serviceType,
      area,
      startDate,
      duration,
      instructions,
      totalAmount,
    } = body;

    const booking = await Booking.create({
      userId: session.userId,
      providerId,
      serviceType,
      area,
      startDate: new Date(startDate),
      duration,
      instructions,
      totalAmount,
      status: "pending",
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
