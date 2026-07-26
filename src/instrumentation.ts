/**
 * Runs once when the Next.js server starts.
 * Connects MongoDB and auto-creates collections + seed data if empty.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { connectDB } = await import("@/lib/mongodb");
      await connectDB();
    } catch (error) {
      console.error(
        "[BuildConnect] MongoDB startup failed — check MONGODB_URI and that MongoDB is running:",
        error
      );
    }
  }
}
