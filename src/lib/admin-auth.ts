import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const COOKIE_NAME = "admin_token";

export async function verifyAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  return token === process.env.ADMIN_PASSWORD;
}

export function verifyAdminFromRequest(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  return token === process.env.ADMIN_PASSWORD;
}

export async function setAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, process.env.ADMIN_PASSWORD!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}
