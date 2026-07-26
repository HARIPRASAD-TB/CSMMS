import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { seedDatabase } from "@/lib/seed-database";

/** GET — check if database has data */
export async function GET() {
  try {
    await connectDB();
    const { User } = await import("@/models/User");
    const count = await User.countDocuments();
    return NextResponse.json({
      connected: true,
      users: count,
      message:
        count > 0
          ? "Database connected and operational."
          : "Database connected — starter data will load on next server start.",
    });
  } catch (e) {
    return NextResponse.json(
      {
        connected: false,
        error: e instanceof Error ? e.message : "MongoDB connection failed",
      },
      { status: 500 }
    );
  }
}

/** POST — reload starter catalogue data. Development only. */
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Force re-seed is disabled in production" },
      { status: 403 }
    );
  }

  try {
    await connectDB();
    const result = await seedDatabase(true);
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
