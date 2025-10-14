import { NextResponse } from "next/server";
import { authenticateUser, signJwt } from "@/lib/auth";

export async function POST(request) {
  const body = await request.json();
  const { email, password } = body || {};
  if (!email || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }
  const user = await authenticateUser(email, password);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = signJwt({ sub: user.id, email: user.email, name: user.name });
  const res = NextResponse.json({ user });
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}


