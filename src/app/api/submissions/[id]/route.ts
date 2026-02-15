import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { submissions, votes } from "@/db/schema";
import { getUserHash } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userHash = await getUserHash();
  if (!userHash) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  const submissionId = parseInt(id, 10);
  if (isNaN(submissionId)) {
    return NextResponse.json({ error: "无效 ID" }, { status: 400 });
  }

  const submission = db
    .select()
    .from(submissions)
    .where(eq(submissions.id, submissionId))
    .get();

  if (!submission) {
    return NextResponse.json({ error: "投稿不存在" }, { status: 404 });
  }

  const voteRows = db
    .select({ vote: votes.vote, count: sql<number>`count(*)` })
    .from(votes)
    .where(eq(votes.submissionId, submissionId))
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

  const myVote = db
    .select({ vote: votes.vote })
    .from(votes)
    .where(
      and(
        eq(votes.voterHash, userHash),
        eq(votes.submissionId, submissionId)
      )
    )
    .get();

  return NextResponse.json({
    ...submission,
    awards: JSON.parse(submission.awards),
    research: JSON.parse(submission.research),
    otherInfo: submission.otherInfo ? JSON.parse(submission.otherInfo) : null,
    targetSchool: JSON.parse(submission.targetSchools),
    votes: voteCounts,
    myVote: myVote?.vote || null,
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userHash = await getUserHash();
  if (!userHash) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  const submissionId = parseInt(id, 10);
  if (isNaN(submissionId)) {
    return NextResponse.json({ error: "无效 ID" }, { status: 400 });
  }

  const submission = db
    .select()
    .from(submissions)
    .where(eq(submissions.id, submissionId))
    .get();

  if (!submission) {
    return NextResponse.json({ error: "投稿不存在" }, { status: 404 });
  }

  if (submission.userHash !== userHash) {
    return NextResponse.json({ error: "只能删除自己的投稿" }, { status: 403 });
  }

  db.delete(votes).where(eq(votes.submissionId, submissionId)).run();
  db.delete(submissions).where(eq(submissions.id, submissionId)).run();

  return NextResponse.json({ success: true });
}
