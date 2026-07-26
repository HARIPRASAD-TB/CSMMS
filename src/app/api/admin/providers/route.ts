import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Provider } from "@/models/Provider";
import { User } from "@/models/User";
import { getSession, requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!requireRole(session, ["admin"])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await connectDB();
    const providers = await Provider.find().sort({ createdAt: -1 }).lean();
    const userIds = providers.map((p) => p.userId);
    const users = await User.find({ _id: { $in: userIds } })
      .select("name email mobile role")
      .lean();
    const userMap = Object.fromEntries(
      users.map((u) => [u._id.toString(), u])
    );

    return NextResponse.json({
      providers: providers.map((p) => ({
        ...p,
        _id: p._id.toString(),
        userId: p.userId.toString(),
        user: userMap[p.userId.toString()],
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
    const { providerId, isApproved, isVerified } = await req.json();
    const provider = await Provider.findByIdAndUpdate(
      providerId,
      { isApproved, isVerified },
      { new: true }
    );
    return NextResponse.json({ provider });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
