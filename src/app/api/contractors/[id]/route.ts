import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Provider } from "@/models/Provider";
import { User } from "@/models/User";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const provider = await Provider.findOne({
      _id: id,
      type: "contractor",
    }).lean();
    if (!provider) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const user = await User.findById(provider.userId)
      .select("name email mobile avatar")
      .lean();
    return NextResponse.json({
      contractor: { ...provider, _id: provider._id.toString(), user },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
