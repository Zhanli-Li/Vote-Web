import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { generateHash, setUserCookie } from "@/lib/auth";

export async function POST() {
  const hash = generateHash();

  db.insert(users).values({ hash }).run();
  await setUserCookie(hash);

  return NextResponse.json({ hash });
}
