import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { submissions, votes } from "@/db/schema";
import { getUserHash } from "@/lib/auth";
import { eq, and, notInArray, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

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
    // [修复 1]: 显式选择字段，排除 userHash
    .select({
      id: submissions.id,
      schoolTier: submissions.schoolTier,
      schoolName: submissions.schoolName,
      rank: submissions.rank,
      totalStudents: submissions.totalStudents,
      awards: submissions.awards,
      research: submissions.research,
      otherInfo: submissions.otherInfo,
      targetSchools: submissions.targetSchools,
      createdAt: submissions.createdAt,
    })
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

  // [修复 2]: 增加服务端校验，防止排名大于总人数
  if (rank > totalStudents) {
    return NextResponse.json({ error: "排名不能大于总人数" }, { status: 400 });
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
