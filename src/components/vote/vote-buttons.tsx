"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VoteOption } from "@/lib/constants";

interface Props {
  onVote: (vote: VoteOption) => void;
  disabled?: boolean;
  selectedVote?: VoteOption | null;
}

const voteConfig: { label: VoteOption; color: string; activeColor: string }[] = [
  {
    label: "OQ",
    color: "border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50",
    activeColor: "bg-emerald-500 text-white border-emerald-500",
  },
  {
    label: "刚好",
    color: "border-blue-200 hover:border-blue-400 hover:bg-blue-50",
    activeColor: "bg-blue-500 text-white border-blue-500",
  },
  {
    label: "不行",
    color: "border-red-200 hover:border-red-400 hover:bg-red-50",
    activeColor: "bg-red-500 text-white border-red-500",
  },
];

export function VoteButtons({ onVote, disabled, selectedVote }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {voteConfig.map(({ label, color, activeColor }) => (
        <Button
          key={label}
          variant="outline"
          size="lg"
          disabled={disabled}
          onClick={() => onVote(label)}
          className={cn(
            "text-base font-medium transition-all",
            selectedVote === label ? activeColor : color
          )}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
