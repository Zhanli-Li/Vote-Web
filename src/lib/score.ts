import { db } from "@/db";
import { votes } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

/**
 * Calculate score for a user.
 * User gets 1 point for each vote where their vote matches the majority.
 */
export function calculateScore(userHash: string): number {
  // Use a single SQL query with window functions to calculate score
  const result = db.all<{ score: number }>(sql`
    WITH vote_counts AS (
      SELECT
        submission_id,
        vote,
        COUNT(*) as cnt,
        MAX(COUNT(*)) OVER (PARTITION BY submission_id) as max_cnt
      FROM votes
      GROUP BY submission_id, vote
    ),
    majority AS (
      SELECT submission_id, vote as majority_vote
      FROM vote_counts
      WHERE cnt = max_cnt
    )
    SELECT COUNT(*) as score
    FROM votes v
    INNER JOIN majority m
      ON v.submission_id = m.submission_id
      AND v.vote = m.majority_vote
    WHERE v.voter_hash = ${userHash}
  `);

  return result[0]?.score ?? 0;
}

export function getTotalVotes(userHash: string): number {
  const result = db
    .select({ count: sql<number>`count(*)` })
    .from(votes)
    .where(eq(votes.voterHash, userHash))
    .get();

  return result?.count ?? 0;
}
