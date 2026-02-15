import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  hash: text("hash").primaryKey(),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const submissions = sqliteTable("submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userHash: text("user_hash")
    .notNull()
    .references(() => users.hash),
  schoolTier: text("school_tier").notNull(),
  schoolName: text("school_name"),
  rank: integer("rank").notNull(),
  totalStudents: integer("total_students").notNull(),
  awards: text("awards").notNull().default("[]"),
  research: text("research").notNull().default("[]"),
  otherInfo: text("other_info"),
  targetSchools: text("target_schools").notNull().default("[]"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const votes = sqliteTable(
  "votes",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    voterHash: text("voter_hash")
      .notNull()
      .references(() => users.hash),
    submissionId: integer("submission_id")
      .notNull()
      .references(() => submissions.id),
    vote: text("vote").notNull(),
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => [
    uniqueIndex("votes_voter_submission_unique").on(
      table.voterHash,
      table.submissionId
    ),
  ]
);
