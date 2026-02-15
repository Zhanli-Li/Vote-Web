"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success("注册成功，请牢记你的 Hash！");
        router.push("/home");
      } else {
        toast.error(data.error || "注册失败");
      }
    } catch {
      toast.error("网络错误");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    if (!hash.trim()) {
      toast.error("请输入 Hash");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash: hash.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("登录成功");
        router.push("/home");
      } else {
        toast.error(data.error || "登录失败");
      }
    } catch {
      toast.error("网络错误");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 bg-gradient-to-br from-neutral-50 to-neutral-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">保研定位</CardTitle>
          <p className="text-muted-foreground text-sm mt-1">
            投稿你的背景，让大家帮你定位
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Button
              onClick={handleRegister}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              领取新 Hash（新用户）
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                或输入已有 Hash
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              placeholder="粘贴你的 Hash"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <Button
              onClick={handleLogin}
              disabled={loading}
              variant="outline"
              className="w-full"
              size="lg"
            >
              登录
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
