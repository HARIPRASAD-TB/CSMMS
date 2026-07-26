import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { getSession, requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!requireRole(session, ["vendor"])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await connectDB();

    const products = await Product.find({ vendorId: session.userId }).lean();
    const orders = await Order.find({ userId: session.userId }).lean();

    const totalSales = orders.length;
    const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

    return NextResponse.json({
      stats: {
        totalProducts: products.length,
        totalOrders: totalSales,
        totalSales,
        totalRevenue,
        recentOrders: orders.slice(-10).reverse(),
        topProducts: products
          .sort((a, b) => b.reviewCount - a.reviewCount)
          .slice(0, 5),
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
