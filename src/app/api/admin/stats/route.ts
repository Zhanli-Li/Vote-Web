import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, submissions, votes } from "@/db/schema";
import { sql, gte } from "drizzle-orm";

export async function GET() {
  const userCount = db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .get()!.count;

  const submissionCount = db
    .select({ count: sql<number>`count(*)` })
    .from(submissions)
    .get()!.count;

  const voteCount = db
    .select({ count: sql<number>`count(*)` })
    .from(votes)
    .get()!.count;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const recentUsers = db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(gte(users.createdAt, sevenDaysAgo))
    .get()!.count;

  const recentSubmissions = db
    .select({ count: sql<number>`count(*)` })
    .from(submissions)
    .where(gte(submissions.createdAt, sevenDaysAgo))
    .get()!.count;

  const recentVotes = db
    .select({ count: sql<number>`count(*)` })
    .from(votes)
    .where(gte(votes.createdAt, sevenDaysAgo))
    .get()!.count;

  return NextResponse.json({
    userCount,
    submissionCount,
    voteCount,
    recent: {
      users: recentUsers,
      submissions: recentSubmissions,
      votes: recentVotes,
    },
  });
}
