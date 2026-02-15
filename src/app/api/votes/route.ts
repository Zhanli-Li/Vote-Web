import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { votes, submissions } from "@/db/schema";
import { getUserHash } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";
import { VOTE_OPTIONS } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const userHash = await getUserHash();
  if (!userHash) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { submissionId, vote } = await request.json();

  if (!submissionId || !vote) {
    return NextResponse.json({ error: "缺少参数" }, { status: 400 });
  }

  if (!VOTE_OPTIONS.includes(vote)) {
    return NextResponse.json({ error: "无效的投票选项" }, { status: 400 });
  }

  // Check submission exists and is not own
  const submission = db
    .select()
    .from(submissions)
    .where(eq(submissions.id, submissionId))
    .get();

  if (!submission) {
    return NextResponse.json({ error: "投稿不存在" }, { status: 404 });
  }

  if (submission.userHash === userHash) {
    return NextResponse.json({ error: "不能给自己的投稿投票" }, { status: 400 });
  }

  // Check if already voted
  const existing = db
    .select()
    .from(votes)
    .where(
      and(
        eq(votes.voterHash, userHash),
        eq(votes.submissionId, submissionId)
      )
    )
    .get();

  if (existing) {
    return NextResponse.json({ error: "已经投过票了" }, { status: 400 });
  }

  // Insert vote
  db.insert(votes)
    .values({
      voterHash: userHash,
      submissionId,
      vote,
    })
    .run();

  // Return vote distribution
  const voteRows = db
    .select({ vote: votes.vote, count: sql<number>`count(*)` })
    .from(votes)
    .where(eq(votes.submissionId, submissionId))
    .groupBy(votes.vote)
    .all();

  const distribution = { OQ: 0, 刚好: 0, 不行: 0, total: 0 };
  for (const row of voteRows) {
    const key = row.vote as keyof typeof distribution;
    if (key in distribution) {
      distribution[key] = row.count;
      distribution.total += row.count;
    }
  }

  return NextResponse.json({ distribution, myVote: vote });
}
