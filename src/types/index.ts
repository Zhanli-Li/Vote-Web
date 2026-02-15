import type { VoteOption } from "@/lib/constants";

export interface Award {
  category: string;
  name: string;
  scope: string;
  rank: string;
}

export interface Research {
  conferenceName?: string;
  conferenceTier: string;
  result: string;
  authorPosition: string;
  direction?: string;
}

export interface TargetSchool {
  name?: string;
  tier: string;
  advisor: string;
  direction: string;
}

export interface SubmissionFormData {
  schoolTier: string;
  schoolName?: string;
  rank: number;
  totalStudents: number;
  awards: Award[];
  research: Research[];
  otherInfo?: string;
  targetSchool?: TargetSchool;
}

export interface SubmissionWithVotes {
  id: number;
  schoolTier: string;
  schoolName: string | null;
  rank: number;
  totalStudents: number;
  awards: Award[];
  research: Research[];
  otherInfo: string | null;
  targetSchool: TargetSchool | null;
  createdAt: string;
  votes: {
    OQ: number;
    刚好: number;
    不行: number;
    total: number;
  };
  myVote?: VoteOption;
}

export interface ProfileData {
  hash: string;
  score: number;
  totalVotes: number;
  createdAt: string;
}
