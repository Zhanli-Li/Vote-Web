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
import {
  CONFERENCE_TIERS,
  PAPER_RESULTS,
  AUTHOR_POSITIONS,
} from "@/lib/constants";
import type { Research } from "@/types";
import { Plus, X } from "lucide-react";

interface Props {
  research: Research[];
  onChange: (research: Research[]) => void;
}

export function ResearchSection({ research, onChange }: Props) {
  function addResearch() {
    onChange([
      ...research,
      {
        conferenceName: "",
        conferenceTier: "CCF-A",
        result: "Poster",
        authorPosition: "学生一作",
        direction: "",
      },
    ]);
  }

  function removeResearch(index: number) {
    onChange(research.filter((_, i) => i !== index));
  }

  function updateResearch(
    index: number,
    field: keyof Research,
    value: string
  ) {
    const updated = research.map((r, i) =>
      i === index ? { ...r, [field]: value } : r
    );
    onChange(updated);
  }

  return (
    <div className="space-y-4">
      {research.map((item, index) => (
        <div
          key={index}
          className="space-y-3 p-3 border rounded-lg relative"
        >
          <button
            type="button"
            onClick={() => removeResearch(index)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="space-y-2">
            <Label>会议名称（选填）</Label>
            <Input
              placeholder="例如：NeurIPS 2025"
              value={item.conferenceName || ""}
              onChange={(e) =>
                updateResearch(index, "conferenceName", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label>会议级别 *</Label>
            <Select
              value={item.conferenceTier}
              onValueChange={(v) =>
                updateResearch(index, "conferenceTier", v)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONFERENCE_TIERS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>成果 *</Label>
              <Select
                value={item.result}
                onValueChange={(v) => updateResearch(index, "result", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAPER_RESULTS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>作者位次 *</Label>
              <Select
                value={item.authorPosition}
                onValueChange={(v) =>
                  updateResearch(index, "authorPosition", v)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUTHOR_POSITIONS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>方向（选填）</Label>
            <Input
              placeholder="例如：CV、NLP"
              value={item.direction || ""}
              onChange={(e) =>
                updateResearch(index, "direction", e.target.value)
              }
            />
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={addResearch}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        添加科研成果
      </Button>
    </div>
  );
}
