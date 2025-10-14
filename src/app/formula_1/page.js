"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator, RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Formula1Page() {
  const [machNumber, setMachNumber] = useState("");
  const [gamma, setGamma] = useState(1.3);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const calculateFormulas = () => {
    if (!machNumber || isNaN(parseFloat(machNumber)) || parseFloat(machNumber) <= 0) {
      setError("Please enter a valid Mach number (M > 0)");
      return;
    }

    const M = parseFloat(machNumber);
    const γ = gamma;

    try {
      // Formula 2: Temperature Ratio T/T₀
      const tempRatio = 1 / (1 + ((γ - 1) / 2) * M * M);

      // Formula 3: Pressure Ratio P/P₀
      const pressureRatio = Math.pow(1 + ((γ - 1) / 2) * M * M, γ / (1 - γ));

      // Formula 4: Density Ratio ρ/ρ₀
      const densityRatio = Math.pow(1 + ((γ - 1) / 2) * M * M, 1 / (1 - γ));

      // Formula 5: Critical Mach Number M*
      const criticalMach = Math.sqrt(((γ + 1) / 2) * M * M / (1 + ((γ - 1) / 2) * M * M));

      // Formula 6: Area Ratio A/A*
      const areaRatio = (1 / M) * Math.pow(
        (2 / (γ + 1)) * (1 + ((γ - 1) / 2) * M * M),
        (γ + 1) / (2 * (γ - 1))
      );

      // Formula 7: Force Ratio F/F*
      const forceRatio = (1 + γ * M * M) / Math.sqrt(
        M * M * 2 * (γ + 1) * (1 + ((γ - 1) / 2) * M * M)
      );

      // Formula 8: Combined Ratio (A/A*) * (P/P₀)
      const combinedRatio = Math.pow(2 / (γ + 1), (γ + 1) / (2 * (γ - 1))) /
        (M * Math.sqrt(1 + ((γ - 1) / 2) * M * M));

      setResults({
        machNumber: M,
        gamma: γ,
        tempRatio,
        pressureRatio,
        densityRatio,
        criticalMach,
        areaRatio,
        forceRatio,
        combinedRatio
      });
      setError("");
    } catch (err) {
      setError("Error in calculation. Please check your input values.");
    }
  };

  const resetCalculator = () => {
    setMachNumber("");
    setGamma(1.3);
    setResults(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-4 py-12">
        {/* Theme Toggle Button */}
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Isentropic flow of perfect gases
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Compressible Flow Calculations - Isentropic Flow Relations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Input Section */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Calculator className="w-6 h-6" />
                Input Parameters
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Enter the Mach number to calculate all related flow properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mach" className="text-base font-medium text-gray-700 dark:text-gray-300">
                  Mach Number (M)
                </Label>
                <Input
                  id="mach"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Enter Mach number (e.g., 0.5, 1.2, 2.0)"
                  value={machNumber}
                  onChange={(e) => setMachNumber(e.target.value)}
                  className="text-lg"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Mach number must be greater than 0
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gamma" className="text-base font-medium text-gray-700 dark:text-gray-300">
                  Specific Heat Ratio (γ)
                </Label>
                <Input
                  id="gamma"
                  type="number"
                  step="0.01"
                  min="1.0"
                  max="2.0"
                  value={gamma}
                  onChange={(e) => setGamma(parseFloat(e.target.value) || 1.3)}
                  className="text-lg"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Default value: 1.3 (typical for air at high temperatures)
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-md">
                  <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={calculateFormulas}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  disabled={!machNumber}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate
                </Button>
                <Button
                  onClick={resetCalculator}
                  variant="outline"
                  className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

              <div className="pt-6">
                <Link href="/">
                  <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Main Page
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-green-200 dark:border-green-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                Calculation Results
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                All calculated flow properties based on your input
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Input Mach Number</p>
                      <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{results.machNumber.toFixed(3)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Specific Heat Ratio</p>
                      <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{results.gamma}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Temperature Ratio (T/T₀)</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{results.tempRatio.toFixed(6)}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pressure Ratio (P/P₀)</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{results.pressureRatio.toFixed(6)}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Density Ratio (ρ/ρ₀)</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{results.densityRatio.toFixed(6)}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Mach Number (M*)</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{results.criticalMach.toFixed(6)}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Area Ratio (A/A*)</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{results.areaRatio.toFixed(6)}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Force Ratio (F/F*)</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{results.forceRatio.toFixed(6)}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Combined Ratio (A/A*) × (P/P₀)</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{results.combinedRatio.toFixed(6)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Enter Mach number and click Calculate to see results
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
