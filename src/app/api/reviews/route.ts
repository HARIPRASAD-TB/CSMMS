import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { Provider } from "@/models/Provider";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const providerId = req.nextUrl.searchParams.get("providerId");
    if (!providerId) {
      return NextResponse.json({ error: "providerId required" }, { status: 400 });
    }
    const reviews = await Review.find({ providerId })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ reviews });
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
    const { providerId, rating, comment } = await req.json();

    const review = await Review.create({
      userId: session.userId,
      providerId,
      rating,
      comment,
    });

    const reviews = await Review.find({ providerId });
    const avg =
      reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await Provider.findByIdAndUpdate(providerId, {
      rating: Math.round(avg * 10) / 10,
      reviewCount: reviews.length,
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to post review" }, { status: 500 });
  }
}
