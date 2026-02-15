"use client";

import { useEffect, useState } from "react";
import { SubmissionResultCard } from "@/components/submission/submission-result-card";
import { Button } from "@/components/ui/button";
import type { SubmissionWithVotes } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function MyPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<SubmissionWithVotes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/submissions/mine", { cache: "no-store" })
      .then((res) => res.json())
      .then(setSubmissions)
      .catch(() => toast.error("加载失败"))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("确定要删除这条投稿吗？相关投票也会一并删除。")) return;
    try {
      const res = await fetch(`/api/submissions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        toast.success("已删除");
      } else {
        const data = await res.json();
        toast.error(data.error || "删除失败");
      }
    } catch {
      toast.error("网络错误");
    }
  }

  if (loading) {
    return (
      <div className="min-h-dvh pb-20 md:pb-8 pt-4 md:pt-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">我的投稿</h1>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-48 bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh pb-20 md:pb-8 pt-4 md:pt-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">我的投稿</h1>
          <Button onClick={() => router.push("/submit")} size="sm">
            新投稿
          </Button>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              你还没有投稿
            </p>
            <Button onClick={() => router.push("/submit")}>
              去投稿
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <SubmissionResultCard
                key={submission.id}
                submission={submission}
                onDelete={() => handleDelete(submission.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
