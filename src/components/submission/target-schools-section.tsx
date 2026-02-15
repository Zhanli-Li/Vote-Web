"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SCHOOL_TIERS, ADVISOR_PREFERENCES } from "@/lib/constants";
import type { TargetSchool } from "@/types";
import { Plus, X } from "lucide-react";

interface Props {
  targetSchools: TargetSchool[];
  onChange: (schools: TargetSchool[]) => void;
}

export function TargetSchoolsSection({ targetSchools, onChange }: Props) {
  function addSchool() {
    onChange([
      ...targetSchools,
      { name: "", tier: "C9", advisor: "任意", direction: "任意" },
    ]);
  }

  function removeSchool(index: number) {
    onChange(targetSchools.filter((_, i) => i !== index));
  }

  function updateSchool(
    index: number,
    field: keyof TargetSchool,
    value: string
  ) {
    const updated = targetSchools.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    onChange(updated);
  }

  return (
    <div className="space-y-4">
      {targetSchools.map((school, index) => (
        <div
          key={index}
          className="space-y-3 p-3 border rounded-lg relative"
        >
          <button
            type="button"
            onClick={() => removeSchool(index)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="space-y-2">
            <Label>目标级别 *</Label>
            <Select
              value={school.tier}
              onValueChange={(v) => updateSchool(index, "tier", v)}
            >
              <SelectTrigger>
                <SelectValue />
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
              value={school.name || ""}
              onChange={(e) => updateSchool(index, "name", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>老师 *</Label>
              <Select
                value={school.advisor}
                onValueChange={(v) => updateSchool(index, "advisor", v)}
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
              <Label>方向</Label>
              <Input
                placeholder="任意"
                value={school.direction === "任意" ? "" : school.direction}
                onChange={(e) =>
                  updateSchool(
                    index,
                    "direction",
                    e.target.value || "任意"
                  )
                }
              />
            </div>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={addSchool}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        添加意向学校
      </Button>
    </div>
  );
}
