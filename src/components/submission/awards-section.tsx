"use client";

import { Button } from "@/components/ui/button";
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
import { AWARD_CATEGORIES, AWARD_SCOPES, AWARD_RANKS } from "@/lib/constants";
import type { Award } from "@/types";
import { Plus, X } from "lucide-react";

interface Props {
  awards: Award[];
  onChange: (awards: Award[]) => void;
  otherInfo: string;
  onOtherInfoChange: (value: string) => void;
}

export function AwardsSection({ awards, onChange, otherInfo, onOtherInfoChange }: Props) {
  function addAward() {
    onChange([
      ...awards,
      { category: "XCPC", name: "", scope: "国家", rank: "一等奖" },
    ]);
  }

  function removeAward(index: number) {
    onChange(awards.filter((_, i) => i !== index));
  }

  function updateAward(index: number, field: keyof Award, value: string) {
    const updated = awards.map((a, i) =>
      i === index ? { ...a, [field]: value } : a
    );
    onChange(updated);
  }

  return (
    <div className="space-y-4">
      {awards.map((award, index) => (
        <div
          key={index}
          className="space-y-3 p-3 border rounded-lg relative"
        >
          <button
            type="button"
            onClick={() => removeAward(index)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="space-y-2">
            <Label>类别</Label>
            <Select
              value={award.category}
              onValueChange={(v) => updateAward(index, "category", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AWARD_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>奖项名称</Label>
            <Input
              placeholder="例如：ICPC 区域赛"
              value={award.name}
              onChange={(e) => updateAward(index, "name", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>级别</Label>
              <Select
                value={award.scope}
                onValueChange={(v) => updateAward(index, "scope", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AWARD_SCOPES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>等级</Label>
              <Select
                value={award.rank}
                onValueChange={(v) => updateAward(index, "rank", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AWARD_RANKS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={addAward}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        添加获奖
      </Button>
      <div className="space-y-2">
        <Label>其他信息（选填）</Label>
        <Textarea
          placeholder="关于获奖的补充说明"
          value={otherInfo}
          onChange={(e) => onOtherInfoChange(e.target.value)}
          rows={2}
        />
      </div>
    </div>
  );
}
