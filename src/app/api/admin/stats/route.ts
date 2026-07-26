import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Provider } from "@/models/Provider";
import { Booking } from "@/models/Booking";
import { Order } from "@/models/Order";
import { getSession, requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!requireRole(session, ["admin"])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await connectDB();

    const [totalUsers, totalProviders, totalVendors, orders, bookings] =
      await Promise.all([
        User.countDocuments({ role: "user" }),
        Provider.countDocuments(),
        User.countDocuments({ role: "vendor" }),
        Order.find().lean(),
        Booking.find().lean(),
      ]);

    const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProviders,
        totalVendors,
        totalRevenue,
        recentBookings: bookings.slice(-5).reverse(),
        recentOrders: orders.slice(-5).reverse(),
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
