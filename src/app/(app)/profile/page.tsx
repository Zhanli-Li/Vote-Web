"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface Profile {
  hash: string;
  score: number;
  totalVotes: number;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then(setProfile)
      .catch(() => toast.error("加载失败"))
      .finally(() => setLoading(false));
  }, []);

  function copyHash() {
    if (profile) {
      navigator.clipboard.writeText(profile.hash);
      toast.success("已复制到剪贴板");
    }
  }

  function handleLogout() {
    document.cookie = "user_hash=; path=/; max-age=0";
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-dvh pb-20 md:pb-8 pt-4 md:pt-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">个人中心</h1>
          <div className="space-y-4">
            <div className="h-40 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-dvh pb-20 md:pb-8 pt-4 md:pt-8">
      <div className="max-w-2xl mx-auto px-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">个人中心</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">你的 Hash</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono break-all">
                {profile.hash}
              </code>
              <Button variant="outline" size="icon" onClick={copyHash}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              这是你的唯一身份凭证，请妥善保存
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{profile.score}</p>
              <p className="text-sm text-muted-foreground mt-1">积分</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{profile.totalVotes}</p>
              <p className="text-sm text-muted-foreground mt-1">投票数</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              注册时间：{new Date(profile.createdAt).toLocaleString("zh-CN")}
            </p>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          退出登录
        </Button>
      </div>
    </div>
  );
}
