import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, submissions, votes } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const userList = db
    .select({
      hash: users.hash,
      createdAt: users.createdAt,
      submissionCount: sql<number>`(SELECT count(*) FROM submissions WHERE submissions.user_hash = users.hash)`,
      voteCount: sql<number>`(SELECT count(*) FROM votes WHERE votes.voter_hash = users.hash)`,
    })
    .from(users)
    .orderBy(sql`users.created_at DESC`)
    .all();

  return NextResponse.json(userList);
}
