"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SchoolSection } from "./school-section";
import { RankingSection } from "./ranking-section";
import { AwardsSection } from "./awards-section";
import { ResearchSection } from "./research-section";
import { TargetSchoolsSection } from "./target-schools-section";
import type { Award, Research, TargetSchool } from "@/types";
import { toast } from "sonner";

export function SubmissionForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [schoolTier, setSchoolTier] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [rank, setRank] = useState("");
  const [totalStudents, setTotalStudents] = useState("");
  const [awards, setAwards] = useState<Award[]>([]);
  const [research, setResearch] = useState<Research[]>([]);
  const [otherInfo, setOtherInfo] = useState("");
  const [targetSchools, setTargetSchools] = useState<TargetSchool[]>([]);

  async function handleSubmit() {
    if (!schoolTier) {
      toast.error("请选择学校分区");
      return;
    }
    if (!rank || !totalStudents) {
      toast.error("请填写排名和总人数");
      return;
    }
    if (parseInt(rank) > parseInt(totalStudents)) {
      toast.error("排名不能大于总人数");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolTier,
          schoolName: schoolName || undefined,
          rank: parseInt(rank),
          totalStudents: parseInt(totalStudents),
          awards,
          research,
          otherInfo: otherInfo || undefined,
          targetSchools,
        }),
      });

      if (res.ok) {
        toast.success("投稿成功！");
        router.push("/my");
      } else {
        const data = await res.json();
        toast.error(data.error || "投稿失败");
      }
    } catch {
      toast.error("网络错误");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="school" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="school">学校</TabsTrigger>
          <TabsTrigger value="ranking">排名</TabsTrigger>
          <TabsTrigger value="awards">获奖</TabsTrigger>
          <TabsTrigger value="research">科研</TabsTrigger>
          <TabsTrigger value="target">意向</TabsTrigger>
        </TabsList>
        <TabsContent value="school" className="mt-4">
          <SchoolSection
            schoolTier={schoolTier}
            schoolName={schoolName}
            onSchoolTierChange={setSchoolTier}
            onSchoolNameChange={setSchoolName}
          />
        </TabsContent>
        <TabsContent value="ranking" className="mt-4">
          <RankingSection
            rank={rank}
            totalStudents={totalStudents}
            onRankChange={setRank}
            onTotalStudentsChange={setTotalStudents}
          />
        </TabsContent>
        <TabsContent value="awards" className="mt-4">
          <AwardsSection awards={awards} onChange={setAwards} />
        </TabsContent>
        <TabsContent value="research" className="mt-4">
          <ResearchSection research={research} onChange={setResearch} />
        </TabsContent>
        <TabsContent value="target" className="mt-4">
          <TargetSchoolsSection
            targetSchools={targetSchools}
            onChange={setTargetSchools}
          />
        </TabsContent>
      </Tabs>

      <div className="space-y-2">
        <Label>其他信息（选填）</Label>
        <Textarea
          placeholder="任何你想补充的信息"
          value={otherInfo}
          onChange={(e) => setOtherInfo(e.target.value)}
          rows={3}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full"
        size="lg"
      >
        {loading ? "提交中..." : "提交投稿"}
      </Button>
    </div>
  );
}
