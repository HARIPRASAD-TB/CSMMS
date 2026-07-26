import bcrypt from "bcryptjs";
import { User } from "@/models/User";
import { Provider } from "@/models/Provider";
import { Product } from "@/models/Product";
import { Booking } from "@/models/Booking";
import { Order } from "@/models/Order";
import { Review } from "@/models/Review";

export const INITIAL_ACCOUNTS = {
  admin: "admin@buildconnect.com",
  user: "user@buildconnect.com",
  worker: "worker@buildconnect.com",
  contractor: "contractor@buildconnect.com",
  vendor: "vendor@buildconnect.com",
  password: "password123",
};

/** @deprecated Use INITIAL_ACCOUNTS */
export const DEMO_ACCOUNTS = INITIAL_ACCOUNTS;

/** Insert starter catalogue data when the database is empty (or reset when force=true). */
export async function seedDatabase(force = false) {
  const existingUsers = await User.countDocuments();

  if (existingUsers > 0 && !force) {
    return { seeded: false, message: "Database already initialized." };
  }

  if (force) {
    await Promise.all([
      User.deleteMany({}),
      Provider.deleteMany({}),
      Product.deleteMany({}),
      Booking.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
    ]);
  }

  const password = await bcrypt.hash(INITIAL_ACCOUNTS.password, 10);

  await User.create({
    name: "Admin User",
      email: INITIAL_ACCOUNTS.admin,
    mobile: "9999999999",
    password,
    role: "admin",
  });

  await User.create({
    name: "Rahul Sharma",
      email: INITIAL_ACCOUNTS.user,
    mobile: "9876543210",
    password,
    role: "user",
    address: "Mumbai, Maharashtra",
  });

  const workerUser1 = await User.create({
    name: "Amit Patel",
      email: INITIAL_ACCOUNTS.worker,
    mobile: "9876543211",
    password,
    role: "worker",
  });

  const workerUser2 = await User.create({
    name: "Suresh Kumar",
    email: "suresh@buildconnect.com",
    mobile: "9876543214",
    password,
    role: "worker",
  });

  const contractorUser = await User.create({
    name: "BuildWell Constructions",
      email: INITIAL_ACCOUNTS.contractor,
    mobile: "9876543212",
    password,
    role: "contractor",
  });

  const vendor = await User.create({
    name: "Steel & Cement Hub",
      email: INITIAL_ACCOUNTS.vendor,
    mobile: "9876543213",
    password,
    role: "vendor",
  });

  const workers = await Provider.insertMany([
    {
      userId: workerUser1._id,
      type: "worker",
      title: "Amit Patel - Expert Painter",
      description: "10+ years experience in interior and exterior painting.",
      location: "Mumbai",
      workerType: "Painter",
      pricePerDay: 800,
      experience: 10,
      rating: 4.8,
      reviewCount: 124,
      portfolio: [
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400",
        "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
      ],
      isVerified: true,
    },
    {
      userId: workerUser2._id,
      type: "worker",
      title: "Suresh Kumar - Carpenter",
      description: "Custom furniture and woodwork specialist.",
      location: "Pune",
      workerType: "Carpenter",
      pricePerDay: 1200,
      experience: 8,
      rating: 4.6,
      reviewCount: 89,
      portfolio: [
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
      ],
      isVerified: true,
    },
  ]);

  const contractor = await Provider.create({
    userId: contractorUser._id,
    type: "contractor",
    title: "BuildWell Constructions",
    description: "Full-service construction company with 15+ years experience.",
    location: "Mumbai",
    pricePerSqFt: 1200,
    experience: 15,
    completedProjects: 250,
    rating: 4.9,
    reviewCount: 312,
    portfolio: [
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600",
    ],
    services: [
      {
        name: "Full Construction",
        pricePerSqFt: 1500,
        description: "Turnkey project",
      },
      {
        name: "Labour Only",
        pricePerSqFt: 450,
        description: "Skilled labour supply",
      },
      {
        name: "Renovation",
        pricePerSqFt: 900,
        description: "Home renovation",
      },
    ],
    isVerified: true,
  });

  await Product.insertMany([
    {
      vendorId: vendor._id,
      name: "UltraTech Cement",
      category: "Cement",
      description: "Premium OPC 53 grade cement for all construction needs.",
      price: 420,
      unit: "bag",
      stock: 500,
      image:
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400",
      features: ["53 Grade", "High Strength", "ISI Certified"],
      rating: 4.7,
      reviewCount: 256,
    },
    {
      vendorId: vendor._id,
      name: "Red Clay Bricks",
      category: "Bricks",
      description: "High-quality red clay bricks for masonry work.",
      price: 8,
      unit: "piece",
      stock: 10000,
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      features: ["Uniform Size", "High Durability"],
      rating: 4.5,
      reviewCount: 189,
    },
    {
      vendorId: vendor._id,
      name: "TMT Steel Bars",
      category: "Steel",
      description: "Fe 500D TMT bars for reinforced concrete.",
      price: 65000,
      unit: "ton",
      stock: 50,
      image:
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400",
      features: ["Fe 500D", "Corrosion Resistant"],
      rating: 4.8,
      reviewCount: 98,
    },
    {
      vendorId: vendor._id,
      name: "Teak Wood Planks",
      category: "Wood",
      description: "Premium teak wood for doors and furniture.",
      price: 2500,
      unit: "cft",
      stock: 200,
      image:
        "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400",
      features: ["Termite Resistant", "Premium Grade"],
      rating: 4.6,
      reviewCount: 67,
    },
  ]);

  return {
    seeded: true,
    message: "Platform initialized with starter listings and accounts.",
    accounts: INITIAL_ACCOUNTS,
    contractorId: contractor._id.toString(),
    workerIds: workers.map((w) => w._id.toString()),
  };
}
