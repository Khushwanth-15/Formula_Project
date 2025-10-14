"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const router = useRouter();

  async function onLogout() {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/welcome");
    } catch {
      // swallow
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 dark:border-gray-700/80 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold">Gas Table</Link>
          {/* <nav className="hidden md:flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
            <Link href="/formula_1" className="hover:underline">Isentropic</Link>
            <Link href="/formula_2" className="hover:underline">Normal Shocks</Link>
            <Link href="/formula_3" className="hover:underline">Wave Angles</Link>
          </nav> */}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button onClick={onLogout} className="px-3 py-1.5 rounded bg-gray-900 text-white text-sm hover:bg-black">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}


