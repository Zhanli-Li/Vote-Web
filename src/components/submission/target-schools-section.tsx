"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SCHOOL_TIERS, ADVISOR_PREFERENCES } from "@/lib/constants";
import type { TargetSchool } from "@/types";

interface Props {
  target: TargetSchool;
  onChange: (target: TargetSchool) => void;
  otherInfo: string;
  onOtherInfoChange: (value: string) => void;
}

export function TargetSchoolSection({ target, onChange, otherInfo, onOtherInfoChange }: Props) {
  function update(field: keyof TargetSchool, value: string) {
    onChange({ ...target, [field]: value });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>目标级别 *</Label>
        <Select
          value={target.tier}
          onValueChange={(v) => update("tier", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择目标级别" />
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
          placeholder="例如：浙江大学"
          value={target.name || ""}
          onChange={(e) => update("name", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>老师 *</Label>
        <Select
          value={target.advisor}
          onValueChange={(v) => update("advisor", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ADVISOR_PREFERENCES.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>方向（选填）</Label>
        <Input
          placeholder="任意"
          value={target.direction === "任意" ? "" : target.direction}
          onChange={(e) => update("direction", e.target.value || "任意")}
        />
      </div>
      <div className="space-y-2">
        <Label>其他信息（选填）</Label>
        <Textarea
          placeholder="关于意向的补充说明"
          value={otherInfo}
          onChange={(e) => onOtherInfoChange(e.target.value)}
          rows={2}
        />
      </div>
    </div>
  );
}
