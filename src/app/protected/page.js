import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import Link from "next/link";

export default async function ProtectedPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value || "";
  const payload = verifyJwt(token);

  if (!payload) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Not authenticated</h1>
          <p className="mb-4">Please login to access this page.</p>
          <div className="space-x-4">
            <Link href="/login" className="underline">Login</Link>
            <Link href="/register" className="underline">Register</Link>
          </div>
        </div>
      </div>
    );
  }

  async function doLogout() {
    "use server";
    await fetch("/api/logout", { method: "POST" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Welcome, {payload.name}</h1>
        <p className="mb-6">Email: {payload.email}</p>
        <form action={doLogout}>
          <button className="px-4 py-2 rounded bg-gray-900 text-white">Logout</button>
        </form>
      </div>
    </div>
  );
}


