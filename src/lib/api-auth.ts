import { NextRequest, NextResponse } from "next/server";
import { getSession, getTokenFromRequest, verifyToken } from "@/lib/auth";
import type { TokenPayload } from "@/lib/auth";

export async function requireSession(
  req?: NextRequest
): Promise<TokenPayload | NextResponse> {
  const session = req
    ? (() => {
        const token = getTokenFromRequest(req);
        return token ? verifyToken(token) : null;
      })()
    : await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

export function isErrorResponse(
  value: TokenPayload | NextResponse
): value is NextResponse {
  return value instanceof NextResponse;
}
