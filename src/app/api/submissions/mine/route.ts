import { NextResponse } from "next/server";
import { db } from "@/db";
import { submissions, votes } from "@/db/schema";
import { getUserHash } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const userHash = await getUserHash();
  if (!userHash) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const mySubmissions = db
    .select()
    .from(submissions)
    .where(eq(submissions.userHash, userHash))
    .orderBy(sql`${submissions.createdAt} DESC`)
    .all();

  const result = mySubmissions.map((s) => {
    const voteRows = db
      .select({ vote: votes.vote, count: sql<number>`count(*)` })
      .from(votes)
      .where(eq(votes.submissionId, s.id))
      .groupBy(votes.vote)
      .all();

    const voteCounts = { OQ: 0, 刚好: 0, 不行: 0, total: 0 };
    for (const row of voteRows) {
      const key = row.vote as keyof typeof voteCounts;
      if (key in voteCounts) {
        voteCounts[key] = row.count;
        voteCounts.total += row.count;
      }
    }

    return {
      ...s,
      awards: JSON.parse(s.awards),
      research: JSON.parse(s.research),
      otherInfo: s.otherInfo ? JSON.parse(s.otherInfo) : null,
      targetSchool: JSON.parse(s.targetSchools),
      votes: voteCounts,
    };
  });

  return NextResponse.json(result);
}
