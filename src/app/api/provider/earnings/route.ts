import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Provider } from "@/models/Provider";
import { Booking } from "@/models/Booking";
import { getSession, requireRole } from "@/lib/auth";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export async function GET() {
  try {
    const session = await getSession();
    if (!requireRole(session, ["worker", "contractor"])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const provider = await Provider.findOne({ userId: session.userId });
    if (!provider) {
      return NextResponse.json(
        { error: "Provider profile not found" },
        { status: 404 }
      );
    }

    const bookings = await Booking.find({ providerId: provider._id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const completed = bookings.filter((b) => b.status === "completed");
    const pending = bookings.filter((b) =>
      ["confirmed", "in_progress"].includes(b.status)
    );

    const totalEarnings = completed.reduce((s, b) => s + b.totalAmount, 0);
    const pendingEarnings = pending.reduce((s, b) => s + b.totalAmount, 0);

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const thisMonthEarnings = completed
      .filter((b) => {
        const d = new Date(b.startDate);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      })
      .reduce((s, b) => s + b.totalAmount, 0);

    const monthlyMap = new Map<string, number>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(thisYear, thisMonth - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      monthlyMap.set(key, 0);
    }

    for (const b of completed) {
      const d = new Date(b.startDate);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (monthlyMap.has(key)) {
        monthlyMap.set(key, (monthlyMap.get(key) || 0) + b.totalAmount);
      }
    }

    const monthlyChart = Array.from(monthlyMap.entries()).map(([key, amount]) => {
      const [, month] = key.split("-").map(Number);
      const year = Number(key.split("-")[0]);
      const label = `${MONTH_LABELS[month]} ${String(year).slice(-2)}`;
      return { month: label, amount };
    });

    const recentEarnings = completed.slice(0, 10).map((b) => ({
      _id: b._id.toString(),
      serviceType: b.serviceType,
      startDate: b.startDate,
      totalAmount: b.totalAmount,
      userId: b.userId,
    }));

    return NextResponse.json({
      earnings: {
        totalEarnings,
        pendingEarnings,
        thisMonthEarnings,
        completedCount: completed.length,
        monthlyChart,
        recentEarnings,
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
