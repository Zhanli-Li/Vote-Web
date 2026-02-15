"use client";

import { SubmissionCard } from "./submission-card";
import { VoteDistribution } from "@/components/vote/vote-distribution";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { SubmissionWithVotes } from "@/types";
import { Trash2 } from "lucide-react";

interface Props {
  submission: SubmissionWithVotes;
  onDelete?: () => void;
}

export function SubmissionResultCard({ submission, onDelete }: Props) {
  return (
    <SubmissionCard submission={submission}>
      <Separator className="my-4" />
      {submission.votes.total > 0 ? (
        <VoteDistribution
          distribution={submission.votes}
          myVote={submission.myVote}
        />
      ) : (
        <p className="text-sm text-muted-foreground text-center">
          暂无投票
        </p>
      )}
      {onDelete && (
        <>
          <Separator className="my-4" />
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            删除投稿
          </Button>
        </>
      )}
    </SubmissionCard>
  );
}
