import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getUserHash } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { calculateScore, getTotalVotes } from "@/lib/score";

export const dynamic = "force-dynamic";

export async function GET() {
  const userHash = await getUserHash();
  if (!userHash) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const user = db
    .select()
    .from(users)
    .where(eq(users.hash, userHash))
    .get();

  if (!user) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  const score = calculateScore(userHash);
  const totalVotes = getTotalVotes(userHash);

  return NextResponse.json({
    hash: user.hash,
    score,
    totalVotes,
    createdAt: user.createdAt,
  });
}
