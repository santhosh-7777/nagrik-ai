import { NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/jwt";

export async function proxy(req) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? await verifyToken(token) : null;

  if (payload?.role === "admin") {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};