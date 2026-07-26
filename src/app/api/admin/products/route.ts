import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { getSession, requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!requireRole(session, ["admin"])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    const vendorIds = products.map((p) => p.vendorId);
    const vendors = await User.find({ _id: { $in: vendorIds } })
      .select("name email")
      .lean();
    const vendorMap = Object.fromEntries(
      vendors.map((v) => [v._id.toString(), v])
    );

    return NextResponse.json({
      products: products.map((p) => ({
        ...p,
        _id: p._id.toString(),
        vendorId: p.vendorId.toString(),
        vendor: vendorMap[p.vendorId.toString()],
      })),
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!requireRole(session, ["admin"])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await connectDB();
    const { productId, isApproved } = await req.json();
    const product = await Product.findByIdAndUpdate(
      productId,
      { isApproved },
      { new: true }
    );
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
