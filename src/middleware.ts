import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import type { UserRole } from "@/lib/auth";
import { getDashboardPath } from "@/lib/permissions";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "buildconnect-dev-secret"
);

interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

async function getSession(
  request: NextRequest
): Promise<TokenPayload | null> {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

const roleRoutes: { prefix: string; roles: UserRole[] }[] = [
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/provider", roles: ["worker", "contractor"] },
  { prefix: "/vendor", roles: ["vendor"] },
];

const authRequired = ["/profile", "/bookings", "/cart"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession(request);

  if (pathname === "/login" && session) {
    return NextResponse.redirect(
      new URL(getDashboardPath(session.role), request.url)
    );
  }

  if (authRequired.some((p) => pathname.startsWith(p)) && !session) {
    const login = new URL("/login", request.url);
    login.searchParams.set("redirect", pathname);
    return NextResponse.redirect(login);
  }

  for (const { prefix, roles } of roleRoutes) {
    if (pathname.startsWith(prefix)) {
      if (!session) {
        const login = new URL("/login", request.url);
        login.searchParams.set("redirect", pathname);
        return NextResponse.redirect(login);
      }
      if (!roles.includes(session.role)) {
        return NextResponse.redirect(
          new URL(getDashboardPath(session.role), request.url)
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/admin/:path*",
    "/provider/:path*",
    "/vendor/:path*",
    "/profile/:path*",
    "/bookings/:path*",
    "/cart/:path*",
  ],
};
