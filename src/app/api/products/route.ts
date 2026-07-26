import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { requireSession, isErrorResponse } from "@/lib/api-auth";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "popular";

    const filter: Record<string, unknown> = { isApproved: true };
    if (category) filter.category = new RegExp(category, "i");

    let query = Product.find(filter);
    if (sort === "price-low") query = query.sort({ price: 1 });
    else if (sort === "price-high") query = query.sort({ price: -1 });
    else query = query.sort({ reviewCount: -1 });

    const products = await query.lean();
    return NextResponse.json({
      products: products.map((p) => ({ ...p, _id: p._id.toString() })),
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession(req);
    if (isErrorResponse(session)) return session;
    if (!requireRole(session, ["admin", "vendor"])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();

    const product = await Product.create({
      vendorId: session.userId,
      name: body.name,
      category: body.category,
      description: body.description || "",
      price: body.price,
      unit: body.unit || "unit",
      stock: body.stock ?? 0,
      image: body.image || "",
      features: body.features
        ? typeof body.features === "string"
          ? body.features.split(",").map((s: string) => s.trim())
          : body.features
        : [],
      isApproved: true,
    });

    return NextResponse.json(
      { product: { ...product.toObject(), _id: product._id.toString() } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
