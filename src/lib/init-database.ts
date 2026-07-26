import mongoose from "mongoose";
import { User } from "@/models/User";
import { Provider } from "@/models/Provider";
import { Product } from "@/models/Product";
import { Booking } from "@/models/Booking";
import { Order } from "@/models/Order";
import { Review } from "@/models/Review";
import { seedDatabase } from "@/lib/seed-database";

/** MongoDB collection names created by Mongoose models */
export const COLLECTIONS = [
  "users",
  "providers",
  "products",
  "bookings",
  "orders",
  "reviews",
] as const;

declare global {
  // eslint-disable-next-line no-var
  var dbSetupDone: boolean | undefined;
  // eslint-disable-next-line no-var
  var dbSetupPromise: Promise<void> | undefined;
}

/**
 * Ensures MongoDB collections exist and loads starter data on first run.
 * MongoDB creates the database + collections automatically on first insert.
 */
export async function runDatabaseSetup(): Promise<void> {
  if (global.dbSetupDone) return;

  if (!global.dbSetupPromise) {
    global.dbSetupPromise = (async () => {
      if (mongoose.connection.readyState !== 1) {
        throw new Error("MongoDB must be connected before database setup");
      }

      // Register models & sync indexes (creates collections if missing)
      await Promise.all([
        User.syncIndexes(),
        Provider.syncIndexes(),
        Product.syncIndexes(),
        Booking.syncIndexes(),
        Order.syncIndexes(),
        Review.syncIndexes(),
      ]);

      const result = await seedDatabase(false);

      if (result.seeded) {
        console.log("[BuildConnect] MongoDB ready:", result.message);
        console.log("[BuildConnect] Collections:", COLLECTIONS.join(", "));
      } else {
        console.log("[BuildConnect] MongoDB connected —", result.message);
      }

      global.dbSetupDone = true;
    })();
  }

  await global.dbSetupPromise;
}
