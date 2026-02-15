import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { submissions, votes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  db.delete(votes).where(eq(votes.submissionId, submissionId)).run();
  db.delete(submissions).where(eq(submissions.id, submissionId)).run();

  return NextResponse.json({ success: true });
}
