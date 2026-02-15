export const SCHOOL_TIERS = [
  "清北",
  "华五",
  "C9",
  "中九",
  "末九",
  "211",
  "双非",
  "四非",
] as const;

export type SchoolTier = (typeof SCHOOL_TIERS)[number];

export const AWARD_CATEGORIES = [
  "XCPC",
  "RM/RC/CTF",
  "其他",
] as const;

export const AWARD_SCOPES = [
  "国际",
  "国家",
  "省级",
] as const;

export const AWARD_RANKS = [
  "一等奖",
  "二等奖",
  "三等奖",
] as const;

export const CONFERENCE_TIERS = [
  "顶会",
  "CCF-A",
  "CCF-B",
  "CCF-C",
  "CCF-None",
] as const;

export const PAPER_RESULTS = [
  "Poster",
  "Spotlight",
  "Oral",
  "BestPaperCandidate",
  "BestPaper",
  "在投",
] as const;

export const AUTHOR_POSITIONS = [
  "独一",
  "学生一作",
  "共一",
  "二作",
  "三作及以后",
] as const;

export const ADVISOR_PREFERENCES = [
  "任意",
  "羊导",
  "好导",
] as const;

export const VOTE_OPTIONS = ["OQ", "刚好", "不行"] as const;

export type VoteOption = (typeof VOTE_OPTIONS)[number];
