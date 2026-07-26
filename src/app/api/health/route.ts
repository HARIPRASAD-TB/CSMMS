import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB, getDatabaseName } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/init-database";
import { User } from "@/models/User";
import { Provider } from "@/models/Provider";
import { Product } from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    const [users, providers, products] = await Promise.all([
      User.countDocuments(),
      Provider.countDocuments(),
      Product.countDocuments(),
    ]);

    return NextResponse.json({
      status: "ok",
      database: getDatabaseName(),
      mongoState: mongoose.connection.readyState,
      collections: COLLECTIONS,
      counts: { users, providers, products },
    });
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: e instanceof Error ? e.message : "Database unavailable",
      },
      { status: 500 }
    );
  }
}
