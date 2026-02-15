"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  rank: string;
  totalStudents: string;
  onRankChange: (value: string) => void;
  onTotalStudentsChange: (value: string) => void;
  otherInfo: string;
  onOtherInfoChange: (value: string) => void;
}

export function RankingSection({
  rank,
  totalStudents,
  onRankChange,
  onTotalStudentsChange,
  otherInfo,
  onOtherInfoChange,
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
      <div className="space-y-2">
        <Label>其他信息（选填）</Label>
        <Textarea
          placeholder="关于排名的补充说明"
          value={otherInfo}
          onChange={(e) => onOtherInfoChange(e.target.value)}
          rows={2}
        />
      </div>
    </div>
  );
}
