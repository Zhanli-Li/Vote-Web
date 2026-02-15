import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { existsSync, mkdirSync } from "fs";

const DB_PATH = "./data/vote.db";

function createDb() {
  if (!existsSync("./data")) {
    mkdirSync("./data", { recursive: true });
  }

  const sqlite = new Database(DB_PATH);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  return drizzle(sqlite, { schema });
}

declare const globalThis: {
  db: ReturnType<typeof createDb> | undefined;
} & typeof global;

export const db = globalThis.db ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalThis.db = db;
}
