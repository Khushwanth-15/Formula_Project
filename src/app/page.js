import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Wind, Zap } from "lucide-react";
import { Header } from "@/components/header";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value || "";
  const payload = verifyJwt(token);
  if (!payload) {
    redirect("/welcome");
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <Header />
      <div className="container mx-auto px-4 py-12">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Gas Table for Compressible Flow Calculations
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive tools for compressible flow analysis and calculations.
            Choose from our specialized formula calculators below.
          </p>
        </div>

        {/* Formula Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Formula 1 Card */}
          <Link href="/formula_1" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 hover:border-blue-300 dark:hover:border-blue-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Isentropic flow of perfect gases
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                  Basic compressible flow calculations and fundamental gas dynamics equations
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-center">

                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Formula 2 Card */}
          <Link href="/formula_2" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 hover:border-green-300 dark:hover:border-green-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Wind className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Normal shocks in perfect gases
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                  Advanced flow calculations including shock waves and expansion fans
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-center">
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Formula 3 Card */}
          <Link href="/formula_3" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 hover:border-purple-300 dark:hover:border-purple-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Wave angles for given deflection
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                  Specialized calculations for high-speed flows and complex geometries
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-center">
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Bottom Section */}
        {/* <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 dark:bg-gray-800/60 rounded-full backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              All calculators are ready for use
            </span>
          </div>
        </div> */}
      </div>
    </div>
  );
}
