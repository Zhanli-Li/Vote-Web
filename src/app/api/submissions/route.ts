import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { submissions, votes } from "@/db/schema";
import { getUserHash } from "@/lib/auth";
import { eq, and, notInArray, sql } from "drizzle-orm";

export async function GET() {
  const userHash = await getUserHash();
  if (!userHash) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  // Get IDs the user has already voted on
  const votedIds = db
    .select({ submissionId: votes.submissionId })
    .from(votes)
    .where(eq(votes.voterHash, userHash))
    .all()
    .map((v) => v.submissionId);

  // Get submissions not by the user and not yet voted on
  let query = db
    .select()
    .from(submissions)
    .where(
      and(
        sql`${submissions.userHash} != ${userHash}`,
        votedIds.length > 0
          ? notInArray(submissions.id, votedIds)
          : undefined
      )
    )
    .orderBy(sql`RANDOM()`)
    .limit(10);

  const results = query.all();

  const parsed = results.map((s) => ({
    ...s,
    awards: JSON.parse(s.awards),
    research: JSON.parse(s.research),
    otherInfo: s.otherInfo ? JSON.parse(s.otherInfo) : null,
    targetSchool: JSON.parse(s.targetSchools),
  }));

  return NextResponse.json(parsed);
}

export async function POST(request: NextRequest) {
  const userHash = await getUserHash();
  if (!userHash) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const body = await request.json();
  const {
    schoolTier,
    schoolName,
    rank,
    totalStudents,
    awards,
    research,
    otherInfo,
    targetSchool,
  } = body;

  if (!schoolTier || !rank || !totalStudents) {
    return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
  }

  const result = db
    .insert(submissions)
    .values({
      userHash,
      schoolTier,
      schoolName: schoolName || null,
      rank,
      totalStudents,
      awards: JSON.stringify(awards || []),
      research: JSON.stringify(research || []),
      otherInfo: otherInfo ? JSON.stringify(otherInfo) : null,
      targetSchools: JSON.stringify(targetSchool || null),
    })
    .returning()
    .get();

  return NextResponse.json(result, { status: 201 });
}
