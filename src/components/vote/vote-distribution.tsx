"use client";

import { cn } from "@/lib/utils";

interface Props {
  distribution: {
    OQ: number;
    刚好: number;
    不行: number;
    total: number;
  };
  myVote?: string | null;
}

const barColors: Record<string, string> = {
  OQ: "bg-emerald-500",
  刚好: "bg-blue-500",
  不行: "bg-red-500",
};

const textColors: Record<string, string> = {
  OQ: "text-emerald-600",
  刚好: "text-blue-600",
  不行: "text-red-600",
};

export function VoteDistribution({ distribution, myVote }: Props) {
  const total = distribution.total || 1;

  return (
    <div className="space-y-2">
      {(["OQ", "刚好", "不行"] as const).map((option) => {
        const count = distribution[option];
        const pct = Math.round((count / total) * 100);
        return (
          <div key={option} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span
                className={cn(
                  "font-medium",
                  myVote === option ? textColors[option] : ""
                )}
              >
                {option}
                {myVote === option && " (你的投票)"}
              </span>
              <span className="text-muted-foreground">
                {count} 票 ({pct}%)
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  barColors[option]
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
      <p className="text-xs text-muted-foreground text-center mt-2">
        共 {distribution.total} 票
      </p>
    </div>
  );
}
