import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Provider } from "@/models/Provider";
import { User } from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");
    const workerType = searchParams.get("workerType");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minRating = searchParams.get("minRating");

    const filter: Record<string, unknown> = {
      type: "worker",
      isApproved: true,
    };
    if (location) filter.location = new RegExp(location, "i");
    if (workerType) filter.workerType = new RegExp(workerType, "i");
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice)
        (filter.pricePerDay as Record<string, number>).$gte =
          parseFloat(minPrice);
      if (maxPrice)
        (filter.pricePerDay as Record<string, number>).$lte =
          parseFloat(maxPrice);
    }

    const providers = await Provider.find(filter).lean();
    const userIds = providers.map((p) => p.userId);
    const users = await User.find({ _id: { $in: userIds } })
      .select("name avatar")
      .lean();
    const userMap = Object.fromEntries(
      users.map((u) => [u._id.toString(), u])
    );

    const result = providers.map((p) => ({
      ...p,
      _id: p._id.toString(),
      user: userMap[p.userId.toString()],
    }));

    return NextResponse.json({ workers: result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch workers" }, { status: 500 });
  }
}
