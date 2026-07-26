import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Provider } from "@/models/Provider";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");
    const serviceType = searchParams.get("serviceType");
    const minRating = searchParams.get("minRating");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const filter: Record<string, unknown> = {
      type: "contractor",
      isApproved: true,
    };

    if (location) filter.location = new RegExp(location, "i");
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };
    if (serviceType) {
      filter["services.name"] = new RegExp(serviceType, "i");
    }
    if (minPrice || maxPrice) {
      filter.pricePerSqFt = {};
      if (minPrice) {
        (filter.pricePerSqFt as Record<string, number>).$gte =
          parseFloat(minPrice);
      }
      if (maxPrice) {
        (filter.pricePerSqFt as Record<string, number>).$lte =
          parseFloat(maxPrice);
      }
    }

    const contractors = await Provider.find(filter)
      .sort({ rating: -1 })
      .lean();

    return NextResponse.json({
      contractors: contractors.map((c) => ({
        ...c,
        _id: c._id.toString(),
        userId: c.userId.toString(),
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
