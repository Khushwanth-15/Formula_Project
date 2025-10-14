import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-4 py-16">
        

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
            Gas Table for Compressible Flow
          </h1>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            A modern toolkit for isentropic flow, normal shocks, and oblique wave angle computations — all in one place.
          </p>
        </div>

        {/* Content Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl">Get started</CardTitle>
              <CardDescription className="text-base">
                Create an account or sign in to access the calculators.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                    <p className="text-gray-700 dark:text-gray-300">
                      Accurate calculations with a clean, responsive interface that works across devices.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-indigo-500"></span>
                    <p className="text-gray-700 dark:text-gray-300">
                      Built with Next.js and Tailwind CSS; theme-aware, fast, and accessible.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                    <p className="text-gray-700 dark:text-gray-300">
                      Demo authentication using secure password hashing and httpOnly cookies.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-stretch gap-3">
                  <Link href="/login" className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Login</Button>
                  </Link>
                  <Link href="/register" className="w-full">
                    <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600">Register</Button>
                  </Link>
                  <Link href="/forgot-password" className="text-sm underline text-gray-600 dark:text-gray-400 text-center">
                    Forgot password?
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


