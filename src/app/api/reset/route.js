import { NextResponse } from "next/server";
import { resetPasswordWithToken } from "@/lib/auth";

export async function POST(request) {
  const body = await request.json();
  const { token, password } = body || {};
  if (!token || !password) {
    return NextResponse.json({ error: "Token and password required" }, { status: 400 });
  }
  const ok = resetPasswordWithToken(token, password);
  if (!ok) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  return NextResponse.json({ ok: true });
}


