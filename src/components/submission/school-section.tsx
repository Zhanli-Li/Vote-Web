"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SCHOOL_TIERS } from "@/lib/constants";

interface Props {
  schoolTier: string;
  schoolName: string;
  onSchoolTierChange: (value: string) => void;
  onSchoolNameChange: (value: string) => void;
}

export function SchoolSection({
  schoolTier,
  schoolName,
  onSchoolTierChange,
  onSchoolNameChange,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>学校分区 *</Label>
        <Select value={schoolTier} onValueChange={onSchoolTierChange}>
          <SelectTrigger>
            <SelectValue placeholder="选择学校分区" />
          </SelectTrigger>
          <SelectContent>
            {SCHOOL_TIERS.map((tier) => (
              <SelectItem key={tier} value={tier}>
                {tier}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>学校名称（选填）</Label>
        <Input
          placeholder="例如：北京大学"
          value={schoolName}
          onChange={(e) => onSchoolNameChange(e.target.value)}
        />
      </div>
    </div>
  );
}
