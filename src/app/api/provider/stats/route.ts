import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Provider } from "@/models/Provider";
import { Booking } from "@/models/Booking";
import { Review } from "@/models/Review";
import { getSession, requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!requireRole(session, ["worker", "contractor"])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await connectDB();
    const provider = await Provider.findOne({ userId: session.userId });
    if (!provider) {
      return NextResponse.json({ error: "Provider profile not found" }, { status: 404 });
    }

    const bookings = await Booking.find({ providerId: provider._id }).lean();
    const reviews = await Review.find({ providerId: provider._id })
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const totalEarnings = bookings
      .filter((b) => b.status === "completed")
      .reduce((s, b) => s + b.totalAmount, 0);

    return NextResponse.json({
      stats: {
        totalBookings: bookings.length,
        active: bookings.filter((b) =>
          ["confirmed", "in_progress"].includes(b.status)
        ).length,
        completed: bookings.filter((b) => b.status === "completed").length,
        totalEarnings,
        upcomingBookings: bookings.filter((b) =>
          ["pending", "confirmed"].includes(b.status)
        ),
        recentReviews: reviews,
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
