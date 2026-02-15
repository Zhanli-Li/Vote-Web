"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  rank: string;
  totalStudents: string;
  onRankChange: (value: string) => void;
  onTotalStudentsChange: (value: string) => void;
}

export function RankingSection({
  rank,
  totalStudents,
  onRankChange,
  onTotalStudentsChange,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>排名 *</Label>
        <Input
          type="number"
          placeholder="例如：3"
          min={1}
          value={rank}
          onChange={(e) => onRankChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>总人数 *</Label>
        <Input
          type="number"
          placeholder="例如：150"
          min={1}
          value={totalStudents}
          onChange={(e) => onTotalStudentsChange(e.target.value)}
        />
      </div>
      {rank && totalStudents && (
        <p className="text-sm text-muted-foreground">
          排名百分比：
          {((parseInt(rank) / parseInt(totalStudents)) * 100).toFixed(1)}%
        </p>
      )}
    </div>
  );
}
