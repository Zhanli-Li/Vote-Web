import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/api/auth/register", "/api/auth/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths — no auth required
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Admin login page and login API — no admin auth required
  if (pathname === "/admin" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // Admin dashboard and admin API routes — require admin_token
  if (pathname.startsWith("/admin/") || (pathname.startsWith("/api/admin/") && pathname !== "/api/admin/login")) {
    const adminToken = request.cookies.get("admin_token")?.value;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminToken || !adminPassword || adminToken !== adminPassword) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "未授权" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Regular user auth — require user_hash
  const hash = request.cookies.get("user_hash")?.value;

  if (!hash) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
