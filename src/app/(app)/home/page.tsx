"use client";

import { useCallback, useEffect, useState } from "react";
import { SubmissionCard } from "@/components/submission/submission-card";
import { VoteButtons } from "@/components/vote/vote-buttons";
import { VoteDistribution } from "@/components/vote/vote-distribution";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { VoteOption } from "@/lib/constants";
import { toast } from "sonner";

interface Submission {
  id: number;
  schoolTier: string;
  schoolName: string | null;
  rank: number;
  totalStudents: number;
  awards: Array<{ category: string; name: string; level: string }>;
  research: Array<{ title: string; description: string }>;
  otherInfo: string | null;
  targetSchool: { name?: string; tier: string; advisor?: string; direction?: string } | null;
}

interface VoteResult {
  distribution: { OQ: number; 刚好: number; 不行: number; total: number };
  myVote: string;
}

export default function HomePage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [voteResult, setVoteResult] = useState<VoteResult | null>(null);
  const [voting, setVoting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
        setCurrentIndex(0);
        setVoteResult(null);
      }
    } catch {
      toast.error("加载失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  async function handleVote(vote: VoteOption) {
    const current = submissions[currentIndex];
    if (!current) return;

    setVoting(true);
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: current.id, vote }),
      });
      const data = await res.json();
      if (res.ok) {
        setVoteResult(data);
      } else {
        toast.error(data.error || "投票失败");
      }
    } catch {
      toast.error("网络错误");
    } finally {
      setVoting(false);
    }
  }

  function handleNext() {
    setVoteResult(null);
    if (currentIndex + 1 < submissions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      fetchSubmissions();
    }
  }

  const current = submissions[currentIndex];

  if (loading) {
    return (
      <div className="min-h-dvh pb-20 md:pb-8 pt-4 md:pt-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">投票</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="min-h-dvh pb-20 md:pb-8 pt-4 md:pt-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-6">投票</h1>
          <p className="text-muted-foreground mb-4">
            暂时没有可投票的投稿了
          </p>
          <Button onClick={fetchSubmissions} variant="outline">
            刷新
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh pb-20 md:pb-8 pt-4 md:pt-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">投票</h1>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1}/{submissions.length}
          </span>
        </div>

        <SubmissionCard submission={current}>
          <Separator className="my-4" />
          {!voteResult ? (
            <VoteButtons onVote={handleVote} disabled={voting} />
          ) : (
            <div className="space-y-4">
              <VoteDistribution
                distribution={voteResult.distribution}
                myVote={voteResult.myVote}
              />
              <Button onClick={handleNext} className="w-full">
                下一个
              </Button>
            </div>
          )}
        </SubmissionCard>
      </div>
    </div>
  );
}
