import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Provider } from "@/models/Provider";
import { requireSession, isErrorResponse } from "@/lib/api-auth";
import { canEditProvider } from "@/lib/permissions";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const provider = await Provider.findById(id).lean();
    if (!provider) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      provider: { ...provider, _id: provider._id.toString() },
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
    const existing = await Provider.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (
      !canEditProvider(
        session.role,
        session.userId,
        existing.userId.toString()
      )
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const updates: Record<string, unknown> = {};

    const fields = [
      "title",
      "description",
      "location",
      "workerType",
      "pricePerDay",
      "pricePerSqFt",
      "experience",
      "completedProjects",
      "portfolio",
      "services",
    ];
    for (const f of fields) {
      if (body[f] !== undefined) updates[f] = body[f];
    }
    if (body.image && !body.portfolio) {
      updates.portfolio = [body.image];
    }

    const provider = await Provider.findByIdAndUpdate(id, updates, {
      new: true,
    });

    return NextResponse.json({
      provider: { ...provider!.toObject(), _id: provider!._id.toString() },
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
    const existing = await Provider.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (
      !canEditProvider(
        session.role,
        session.userId,
        existing.userId.toString()
      )
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Provider.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
