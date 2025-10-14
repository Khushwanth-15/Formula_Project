import { NextResponse } from "next/server";
import { issueResetToken } from "@/lib/auth";

export async function POST(request) {
  const body = await request.json();
  const { email } = body || {};
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
  const tokenInfo = await issueResetToken(email);
  // In a real app, email the token link; here we return it for demo.
  if (!tokenInfo) return NextResponse.json({ ok: true });
  return NextResponse.json({ ok: true, token: tokenInfo.token, exp: tokenInfo.exp });
}


