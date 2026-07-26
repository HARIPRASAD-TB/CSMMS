import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Provider } from "@/models/Provider";
import { requireSession, isErrorResponse } from "@/lib/api-auth";
import { requireRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession(req);
    if (isErrorResponse(session)) return session;

    const body = await req.json();
    const { type } = body;

    if (type === "worker" && !requireRole(session, ["admin", "worker"])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (
      type === "contractor" &&
      !requireRole(session, ["admin", "contractor"])
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const provider = await Provider.create({
      userId: session.userId,
      type,
      title: body.title,
      description: body.description || "",
      location: body.location,
      workerType: body.workerType,
      pricePerDay: body.pricePerDay,
      pricePerSqFt: body.pricePerSqFt,
      experience: body.experience || 0,
      completedProjects: body.completedProjects || 0,
      portfolio: body.portfolio || (body.image ? [body.image] : []),
      services: body.services || [],
      isVerified: true,
      isApproved: true,
    });

    return NextResponse.json(
      { provider: { ...provider.toObject(), _id: provider._id.toString() } },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
