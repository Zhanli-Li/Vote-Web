import { NextRequest, NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: "管理员密码未配置" }, { status: 500 });
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "密码错误" }, { status: 401 });
  }

  await setAdminCookie();
  return NextResponse.json({ success: true });
}
