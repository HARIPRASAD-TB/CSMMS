import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { requireSession, isErrorResponse } from "@/lib/api-auth";
import { canEditProduct } from "@/lib/permissions";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id).lean();
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      product: { ...product, _id: product._id.toString() },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession(req);
    if (isErrorResponse(session)) return session;

    await connectDB();
    const { id } = await params;
    const existing = await Product.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (
      !canEditProduct(
        session.role,
        session.userId,
        existing.vendorId.toString()
      )
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const updates: Record<string, unknown> = {};
    const fields = [
      "name",
      "category",
      "description",
      "price",
      "unit",
      "stock",
      "image",
      "features",
    ];
    for (const f of fields) {
      if (body[f] !== undefined) {
        if (f === "features" && typeof body[f] === "string") {
          updates[f] = body[f].split(",").map((s: string) => s.trim());
        } else {
          updates[f] = body[f];
        }
      }
    }

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({
      product: { ...product!.toObject(), _id: product!._id.toString() },
    });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession(req);
    if (isErrorResponse(session)) return session;

    await connectDB();
    const { id } = await params;
    const existing = await Product.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (
      !canEditProduct(
        session.role,
        session.userId,
        existing.vendorId.toString()
      )
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
