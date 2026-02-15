import { nanoid } from "nanoid";
import { cookies } from "next/headers";

const COOKIE_NAME = "user_hash";

export function generateHash(): string {
  return nanoid(21);
}

export async function getUserHash(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export async function setUserCookie(hash: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, hash, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
