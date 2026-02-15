"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2, ChevronDown, ChevronRight, LogOut, Users, FileText, Vote } from "lucide-react";
import { useRouter } from "next/navigation";

interface Stats {
  userCount: number;
  submissionCount: number;
  voteCount: number;
  recent: {
    users: number;
    submissions: number;
    votes: number;
  };
}

interface UserRow {
  hash: string;
  createdAt: string;
  submissionCount: number;
  voteCount: number;
}

interface Submission {
  id: number;
  schoolTier: string;
  schoolName: string | null;
  rank: number;
  totalStudents: number;
  awards: string;
  research: string;
  otherInfo: string | null;
  targetSchools: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [userSubmissions, setUserSubmissions] = useState<Record<string, Submission[]>>({});
  const [loading, setLoading] = useState(true);

  const refreshStats = useCallback(async () => {
    const res = await fetch("/api/admin/stats");
    if (res.ok) setStats(await res.json());
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users"),
      ]);
      if (statsRes.status === 401 || usersRes.status === 401) {
        router.push("/admin");
        return;
      }
      if (!statsRes.ok || !usersRes.ok) throw new Error();
      setStats(await statsRes.json());
      setUsers(await usersRes.json());
    } catch {
      toast.error("加载数据失败");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handleToggleUser(hash: string) {
    if (expandedUser === hash) {
      setExpandedUser(null);
    } else {
      setExpandedUser(hash);
    }
  }

  async function handleDeleteUser(hash: string) {
    if (!confirm(`确认删除用户 ${hash.slice(0, 8)}... 及其所有投稿和投票？`)) return;
    try {
      const res = await fetch(`/api/admin/users/${hash}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("用户已删除");
        setUsers((prev) => prev.filter((u) => u.hash !== hash));
        if (expandedUser === hash) setExpandedUser(null);
        refreshStats();
      } else {
        const data = await res.json();
        toast.error(data.error || "删除失败");
      }
    } catch {
      toast.error("网络错误");
    }
  }

  async function handleDeleteSubmission(submissionId: number, userHash: string) {
    if (!confirm("确认删除该投稿及其所有投票？")) return;
    try {
      const res = await fetch(`/api/admin/submissions/${submissionId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("投稿已删除");
        setUserSubmissions((prev) => ({
          ...prev,
          [userHash]: prev[userHash]?.filter((s) => s.id !== submissionId) ?? [],
        }));
        setUsers((prev) =>
          prev.map((u) =>
            u.hash === userHash ? { ...u, submissionCount: u.submissionCount - 1 } : u
          )
        );
        refreshStats();
      } else {
        const data = await res.json();
        toast.error(data.error || "删除失败");
      }
    } catch {
      toast.error("网络错误");
    }
  }

  function handleLogout() {
    document.cookie = "admin_token=; path=/; max-age=0";
    router.push("/admin");
  }

  if (loading) {
    return (
      <div className="min-h-dvh pt-4 md:pt-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">管理面板</h1>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh pt-4 md:pt-8 pb-8">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">管理面板</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            退出
          </Button>
        </div>

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.userCount}</p>
                    <p className="text-sm text-muted-foreground">用户总数</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  近7日 +{stats.recent.users}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.submissionCount}</p>
                    <p className="text-sm text-muted-foreground">投稿总数</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  近7日 +{stats.recent.submissions}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Vote className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.voteCount}</p>
                    <p className="text-sm text-muted-foreground">投票总数</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  近7日 +{stats.recent.votes}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">用户列表</CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">暂无用户</p>
            ) : (
              <div>
                <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_80px_80px_60px] gap-2 px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                  <span>Hash</span>
                  <span>注册时间</span>
                  <span className="text-center">投稿</span>
                  <span className="text-center">投票</span>
                  <span className="text-center">操作</span>
                </div>
                {users.map((user) => (
                  <div key={user.hash} className="border-b last:border-0">
                    <div
                      className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_1fr_80px_80px_60px] gap-2 px-3 py-3 items-center hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleToggleUser(user.hash)}
                    >
                      <div className="flex items-center gap-2">
                        {expandedUser === user.hash ? (
                          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        <code className="text-sm font-mono truncate">
                          {user.hash.slice(0, 8)}...
                        </code>
                      </div>
                      <span className="text-sm text-muted-foreground hidden sm:block">
                        {new Date(user.createdAt).toLocaleString("zh-CN")}
                      </span>
                      <span className="text-sm text-center hidden sm:block">
                        {user.submissionCount}
                      </span>
                      <span className="text-sm text-center hidden sm:block">
                        {user.voteCount}
                      </span>
                      <div className="flex justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUser(user.hash);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {expandedUser === user.hash && (
                      <div className="sm:hidden px-3 pb-2 flex gap-4 text-xs text-muted-foreground">
                        <span>{new Date(user.createdAt).toLocaleString("zh-CN")}</span>
                        <span>投稿: {user.submissionCount}</span>
                        <span>投票: {user.voteCount}</span>
                      </div>
                    )}

                    {expandedUser === user.hash && (
                      <UserSubmissions
                        userHash={user.hash}
                        submissions={userSubmissions[user.hash]}
                        onLoaded={(subs) =>
                          setUserSubmissions((prev) => ({ ...prev, [user.hash]: subs }))
                        }
                        onDelete={(id) => handleDeleteSubmission(id, user.hash)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UserSubmissions({
  userHash,
  submissions,
  onLoaded,
  onDelete,
}: {
  userHash: string;
  submissions?: Submission[];
  onLoaded: (subs: Submission[]) => void;
  onDelete: (id: number) => void;
}) {
  const [loading, setLoading] = useState(!submissions);

  useEffect(() => {
    if (submissions) return;
    let cancelled = false;
    fetch(`/api/admin/users/${userHash}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled) onLoaded(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) onLoaded([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [userHash, submissions, onLoaded]);

  if (loading) {
    return (
      <div className="px-3 py-4 ml-6">
        <div className="h-16 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="px-3 py-3 ml-6">
        <p className="text-sm text-muted-foreground">暂无投稿</p>
      </div>
    );
  }

  return (
    <div className="px-3 py-2 ml-6 space-y-2">
      {submissions.map((sub) => {
        const awards = typeof sub.awards === "string" ? JSON.parse(sub.awards) : sub.awards;
        const targetSchools =
          typeof sub.targetSchools === "string" ? JSON.parse(sub.targetSchools) : sub.targetSchools;
        return (
          <div key={sub.id} className="border rounded-lg p-3 bg-muted/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  {sub.schoolTier}
                </Badge>
                {sub.schoolName && (
                  <span className="text-xs text-muted-foreground">{sub.schoolName}</span>
                )}
                <span className="text-xs">
                  排名 {sub.rank}/{sub.totalStudents}
                </span>
                <span className="text-xs text-muted-foreground">#{sub.id}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive shrink-0"
                onClick={() => onDelete(sub.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            {awards.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {awards.map((a: { name: string }, i: number) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {a.name}
                  </Badge>
                ))}
              </div>
            )}
            {Array.isArray(targetSchools) && targetSchools.length > 0 && (
              <p className="text-xs text-muted-foreground">
                意向：
                {targetSchools
                  .map((t: { tier: string; name?: string }) => t.name || t.tier)
                  .join("、")}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {new Date(sub.createdAt).toLocaleString("zh-CN")}
            </p>
          </div>
        );
      })}
    </div>
  );
}
