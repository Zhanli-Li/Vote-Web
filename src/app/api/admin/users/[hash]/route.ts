import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, submissions, votes } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  const { hash } = await params;

  const userSubmissions = db
    .select()
    .from(submissions)
    .where(eq(submissions.userHash, hash))
    .orderBy(submissions.createdAt)
    .all();

  return NextResponse.json(userSubmissions);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  const { hash } = await params;

  const user = db.select().from(users).where(eq(users.hash, hash)).get();
  if (!user) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  // Get all submission IDs for this user
  const userSubmissions = db
    .select({ id: submissions.id })
    .from(submissions)
    .where(eq(submissions.userHash, hash))
    .all();

  const submissionIds = userSubmissions.map((s) => s.id);

  // Delete votes on this user's submissions
  if (submissionIds.length > 0) {
    db.delete(votes).where(inArray(votes.submissionId, submissionIds)).run();
  }

  // Delete votes cast by this user
  db.delete(votes).where(eq(votes.voterHash, hash)).run();

  // Delete user's submissions
  db.delete(submissions).where(eq(submissions.userHash, hash)).run();

  // Delete the user
  db.delete(users).where(eq(users.hash, hash)).run();

  return NextResponse.json({ success: true });
}
