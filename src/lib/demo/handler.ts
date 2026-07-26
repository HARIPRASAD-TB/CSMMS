import type { AuthUser } from "@/context/AuthContext";

export const DEMO_PASSWORD = "password123";

export const DEMO_ACCOUNTS: Record<
  string,
  AuthUser & { password: string }
> = {
  "admin@buildconnect.com": {
    _id: "demo-admin",
    name: "Admin User",
    email: "admin@buildconnect.com",
    role: "admin",
    mobile: "9999999999",
    password: DEMO_PASSWORD,
  },
  "user@buildconnect.com": {
    _id: "demo-user",
    name: "Rahul Sharma",
    email: "user@buildconnect.com",
    role: "user",
    mobile: "9876543210",
    address: "Mumbai, Maharashtra",
    password: DEMO_PASSWORD,
  },
  "worker@buildconnect.com": {
    _id: "demo-worker-user",
    name: "Amit Patel",
    email: "worker@buildconnect.com",
    role: "worker",
    mobile: "9876543211",
    password: DEMO_PASSWORD,
  },
  "contractor@buildconnect.com": {
    _id: "demo-contractor-user",
    name: "BuildWell Constructions",
    email: "contractor@buildconnect.com",
    role: "contractor",
    mobile: "9876543212",
    password: DEMO_PASSWORD,
  },
  "vendor@buildconnect.com": {
    _id: "demo-vendor",
    name: "Steel & Cement Hub",
    email: "vendor@buildconnect.com",
    role: "vendor",
    mobile: "9876543213",
    password: DEMO_PASSWORD,
  },
};

const portfolio = [
  "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400",
  "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400",
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
];

export const DEMO_WORKERS = [
  {
    _id: "demo",
    userId: "demo-worker-user",
    type: "worker" as const,
    title: "Amit Patel - Expert Painter",
    description: "10+ years experience in interior and exterior painting.",
    location: "Mumbai",
    workerType: "Painter",
    pricePerDay: 800,
    experience: 10,
    rating: 4.8,
    reviewCount: 124,
    portfolio,
    isVerified: true,
    isApproved: true,
    user: { name: "Amit Patel" },
  },
  {
    _id: "worker-2",
    userId: "worker-user-2",
    type: "worker" as const,
    title: "Suresh Kumar - Carpenter",
    description: "Custom furniture and woodwork specialist.",
    location: "Pune",
    workerType: "Carpenter",
    pricePerDay: 1200,
    experience: 8,
    rating: 4.6,
    reviewCount: 89,
    portfolio,
    isVerified: true,
    isApproved: true,
    user: { name: "Suresh Kumar" },
  },
  {
    _id: "worker-3",
    userId: "worker-user-3",
    type: "worker" as const,
    title: "Rajesh Verma - Electrician",
    description: "Licensed electrician for residential and commercial wiring.",
    location: "Delhi",
    workerType: "Electrician",
    pricePerDay: 950,
    experience: 12,
    rating: 4.7,
    reviewCount: 156,
    portfolio,
    isVerified: true,
    isApproved: true,
    user: { name: "Rajesh Verma" },
  },
];

export const DEMO_CONTRACTORS = [
  {
    _id: "demo",
    userId: "demo-contractor-user",
    type: "contractor" as const,
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
      { name: "Full Construction", pricePerSqFt: 1500, description: "Turnkey project" },
      { name: "Labour Only", pricePerSqFt: 450, description: "Skilled labour supply" },
      { name: "Renovation", pricePerSqFt: 900, description: "Home renovation" },
    ],
    isVerified: true,
    isApproved: true,
  },
  {
    _id: "contractor-2",
    userId: "contractor-user-2",
    type: "contractor" as const,
    title: "UrbanBuild Projects",
    description: "Commercial and residential construction across Maharashtra.",
    location: "Pune",
    pricePerSqFt: 1100,
    experience: 10,
    completedProjects: 120,
    rating: 4.5,
    reviewCount: 88,
    portfolio: [
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600",
    ],
    services: [
      { name: "Full Construction", pricePerSqFt: 1400, description: "End-to-end build" },
    ],
    isVerified: true,
    isApproved: true,
  },
];

export const DEMO_PRODUCTS = [
  {
    _id: "demo",
    vendorId: "demo-vendor",
    name: "UltraTech Cement",
    category: "Cement",
    description: "Premium OPC 53 grade cement for all construction needs.",
    price: 420,
    unit: "bag",
    stock: 500,
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400",
    features: ["53 Grade", "High Strength", "ISI Certified"],
    rating: 4.7,
    reviewCount: 256,
    isApproved: true,
  },
  {
    _id: "product-2",
    vendorId: "demo-vendor",
    name: "Red Clay Bricks",
    category: "Bricks",
    description: "High-quality red clay bricks for masonry work.",
    price: 8,
    unit: "piece",
    stock: 10000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    features: ["Uniform Size", "High Durability"],
    rating: 4.5,
    reviewCount: 189,
    isApproved: true,
  },
  {
    _id: "product-3",
    vendorId: "demo-vendor",
    name: "TMT Steel Bars",
    category: "Steel",
    description: "Fe 500D TMT bars for reinforced concrete.",
    price: 65000,
    unit: "ton",
    stock: 50,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400",
    features: ["Fe 500D", "Corrosion Resistant"],
    rating: 4.8,
    reviewCount: 98,
    isApproved: true,
  },
  {
    _id: "product-4",
    vendorId: "demo-vendor",
    name: "Teak Wood Planks",
    category: "Wood",
    description: "Premium teak wood for doors and furniture.",
    price: 2500,
    unit: "cft",
    stock: 200,
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400",
    features: ["Termite Resistant", "Premium Grade"],
    rating: 4.6,
    reviewCount: 67,
    isApproved: true,
  },
];

export const DEMO_PROVIDERS = [...DEMO_WORKERS, ...DEMO_CONTRACTORS];

export const DEMO_REVIEWS = [
  {
    _id: "review-1",
    providerId: "demo",
    userId: "demo-user",
    userName: "Rahul Sharma",
    rating: 5,
    comment: "Excellent work, very professional and on time.",
    createdAt: new Date().toISOString(),
  },
];

const SESSION_KEY = "buildconnect_demo_session";

export function getDemoSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setDemoSession(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function filterWorkers(params: URLSearchParams) {
  let list = [...DEMO_WORKERS];
  const location = params.get("location");
  const workerType = params.get("workerType");
  const minRating = params.get("minRating");
  const q = params.get("q");
  if (location) {
    list = list.filter((w) =>
      w.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  if (workerType) {
    list = list.filter((w) =>
      w.workerType.toLowerCase().includes(workerType.toLowerCase())
    );
  }
  if (minRating) {
    list = list.filter((w) => w.rating >= parseFloat(minRating));
  }
  if (q) {
    const term = q.toLowerCase();
    list = list.filter(
      (w) =>
        w.title.toLowerCase().includes(term) ||
        w.workerType.toLowerCase().includes(term) ||
        w.location.toLowerCase().includes(term) ||
        w.description.toLowerCase().includes(term)
    );
  }
  return list;
}

function filterContractors(params: URLSearchParams) {
  let list = [...DEMO_CONTRACTORS];
  const location = params.get("location");
  const minRating = params.get("minRating");
  if (location) {
    list = list.filter((c) =>
      c.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  if (minRating) {
    list = list.filter((c) => c.rating >= parseFloat(minRating));
  }
  return list;
}

function filterProducts(params: URLSearchParams) {
  let list = [...DEMO_PRODUCTS];
  const category = params.get("category");
  const sort = params.get("sort") || "popular";
  if (category) {
    list = list.filter((p) =>
      p.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  if (sort === "price-low") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-high") list.sort((a, b) => b.price - a.price);
  else list.sort((a, b) => b.reviewCount - a.reviewCount);
  return list;
}

export async function demoFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const [pathname, query = ""] = path.split("?");
  const params = new URLSearchParams(query);
  const method = (init?.method || "GET").toUpperCase();
  const body = init?.body
    ? JSON.parse(typeof init.body === "string" ? init.body : "{}")
    : null;

  if (pathname === "/api/auth/login" && method === "POST") {
    const account = DEMO_ACCOUNTS[String(body.email).toLowerCase()];
    if (!account || account.password !== body.password) {
      return json({ error: "Invalid credentials" }, 401);
    }
    const { password: _, ...user } = account;
    setDemoSession(user);
    return json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  }

  if (pathname === "/api/auth/register" && method === "POST") {
    const user = {
      _id: `demo-${Date.now()}`,
      name: body.name,
      email: body.email,
      role: body.role || "user",
      mobile: body.mobile,
    };
    setDemoSession(user as AuthUser);
    return json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  }

  if (pathname === "/api/auth/logout" && method === "POST") {
    setDemoSession(null);
    return json({ success: true });
  }

  if (pathname === "/api/auth/me" && method === "GET") {
    const user = getDemoSession();
    if (!user) return json({ error: "Unauthorized" }, 401);
    return json({ user });
  }

  if (pathname === "/api/workers") {
    return json({ workers: filterWorkers(params) });
  }

  if (pathname === "/api/contractors") {
    return json({ contractors: filterContractors(params) });
  }

  if (pathname === "/api/products") {
    if (method === "POST") {
      return json({ product: { _id: `product-${Date.now()}`, ...body } });
    }
    return json({ products: filterProducts(params) });
  }

  const providerMatch = pathname.match(/^\/api\/providers\/([^/]+)$/);
  if (providerMatch) {
    const provider = DEMO_PROVIDERS.find((p) => p._id === providerMatch[1]);
    if (!provider) return json({ error: "Not found" }, 404);
    if (method === "PATCH" || method === "DELETE") {
      return json({ success: true, provider });
    }
    return json({ provider });
  }

  const productMatch = pathname.match(/^\/api\/products\/([^/]+)$/);
  if (productMatch) {
    const product = DEMO_PRODUCTS.find((p) => p._id === productMatch[1]);
    if (!product) return json({ error: "Not found" }, 404);
    if (method === "PATCH" || method === "DELETE") {
      return json({ success: true, product });
    }
    return json({ product });
  }

  const contractorMatch = pathname.match(/^\/api\/contractors\/([^/]+)$/);
  if (contractorMatch) {
    const contractor = DEMO_CONTRACTORS.find((c) => c._id === contractorMatch[1]);
    if (!contractor) return json({ error: "Not found" }, 404);
    return json({ contractor });
  }

  if (pathname === "/api/reviews") {
    if (method === "POST") {
      return json({ review: { _id: `review-${Date.now()}`, ...body } });
    }
    const providerId = params.get("providerId");
    const reviews = providerId
      ? DEMO_REVIEWS.filter((r) => r.providerId === providerId)
      : DEMO_REVIEWS;
    return json({ reviews });
  }

  if (pathname === "/api/my-activity") {
    return json({ bookings: [], orders: [] });
  }

  if (pathname === "/api/users/profile" && method === "PATCH") {
    const user = getDemoSession();
    if (!user) return json({ error: "Unauthorized" }, 401);
    const updated = { ...user, ...body };
    setDemoSession(updated);
    return json({ user: updated });
  }

  if (pathname === "/api/bookings" || pathname.startsWith("/api/bookings/")) {
    if (method === "POST" || method === "PATCH") {
      return json({ booking: { _id: `booking-${Date.now()}`, ...body, status: "pending" } });
    }
    return json({ bookings: [] });
  }

  if (pathname === "/api/orders" || pathname.startsWith("/api/orders/")) {
    if (method === "POST" || method === "PATCH") {
      return json({ order: { _id: `order-${Date.now()}`, ...body, status: "pending" } });
    }
    return json({ orders: [] });
  }

  if (pathname === "/api/admin/stats") {
    return json({
      stats: {
        users: 5,
        providers: DEMO_PROVIDERS.length,
        products: DEMO_PRODUCTS.length,
        bookings: 0,
        orders: 0,
        revenue: 0,
      },
    });
  }

  if (pathname === "/api/admin/users") {
    const users = Object.values(DEMO_ACCOUNTS).map(({ password: _, ...u }) => u);
    return json({ users });
  }

  if (pathname === "/api/admin/providers") {
    return json({ providers: DEMO_PROVIDERS });
  }

  if (pathname === "/api/admin/products") {
    return json({ products: DEMO_PRODUCTS });
  }

  if (pathname === "/api/provider/stats") {
    return json({
      stats: { totalBookings: 0, pendingBookings: 0, completedBookings: 0, earnings: 0 },
    });
  }

  if (pathname === "/api/provider/earnings") {
    return json({ earnings: [] });
  }

  if (pathname === "/api/vendor/stats") {
    return json({
      stats: { totalProducts: DEMO_PRODUCTS.length, totalOrders: 0, revenue: 0 },
    });
  }

  if (pathname === "/api/providers" && method === "POST") {
    return json({ provider: { _id: `provider-${Date.now()}`, ...body } });
  }

  return json(
    {
      error: "Demo mode: this action is simulated on GitHub Pages.",
      demo: true,
    },
    501
  );
}
