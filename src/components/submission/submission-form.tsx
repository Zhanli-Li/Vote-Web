"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SchoolSection } from "./school-section";
import { RankingSection } from "./ranking-section";
import { AwardsSection } from "./awards-section";
import { ResearchSection } from "./research-section";
import { TargetSchoolSection } from "./target-schools-section";
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
  const [otherInfo, setOtherInfo] = useState<Record<string, string>>({});
  const [targetSchool, setTargetSchool] = useState<TargetSchool>({
    tier: "",
    advisor: "任意",
    direction: "任意",
  });

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
          otherInfo: Object.values(otherInfo).some((v) => v) ? otherInfo : undefined,
          targetSchool: targetSchool.tier ? targetSchool : undefined,
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
            otherInfo={otherInfo.school || ""}
            onOtherInfoChange={(v) => setOtherInfo({ ...otherInfo, school: v })}
          />
        </TabsContent>
        <TabsContent value="ranking" className="mt-4">
          <RankingSection
            rank={rank}
            totalStudents={totalStudents}
            onRankChange={setRank}
            onTotalStudentsChange={setTotalStudents}
            otherInfo={otherInfo.ranking || ""}
            onOtherInfoChange={(v) => setOtherInfo({ ...otherInfo, ranking: v })}
          />
        </TabsContent>
        <TabsContent value="awards" className="mt-4">
          <AwardsSection
            awards={awards}
            onChange={setAwards}
            otherInfo={otherInfo.awards || ""}
            onOtherInfoChange={(v) => setOtherInfo({ ...otherInfo, awards: v })}
          />
        </TabsContent>
        <TabsContent value="research" className="mt-4">
          <ResearchSection
            research={research}
            onChange={setResearch}
            otherInfo={otherInfo.research || ""}
            onOtherInfoChange={(v) => setOtherInfo({ ...otherInfo, research: v })}
          />
        </TabsContent>
        <TabsContent value="target" className="mt-4">
          <TargetSchoolSection
            target={targetSchool}
            onChange={setTargetSchool}
            otherInfo={otherInfo.target || ""}
            onOtherInfoChange={(v) => setOtherInfo({ ...otherInfo, target: v })}
          />
        </TabsContent>
      </Tabs>

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
