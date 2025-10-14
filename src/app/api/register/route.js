import { NextResponse } from "next/server";
import { createUser, signJwt } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body || {};
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const user = createUser({ name, email, password });
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
  } catch (e) {
    return NextResponse.json({ error: e.message || "Unable to register" }, { status: 400 });
  }
}


