import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { setUserCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { hash } = await request.json();

  if (!hash || typeof hash !== "string") {
    return NextResponse.json({ error: "请输入 Hash" }, { status: 400 });
  }

  const user = db.select().from(users).where(eq(users.hash, hash)).get();

  if (!user) {
    return NextResponse.json({ error: "Hash 不存在" }, { status: 404 });
  }

  await setUserCookie(hash);

  return NextResponse.json({ hash });
}
