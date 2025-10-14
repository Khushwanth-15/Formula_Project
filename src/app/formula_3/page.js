"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Zap, RefreshCw, Calculator } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Formula3Page() {
  const [m1, setM1] = useState("");
  const [gamma, setGamma] = useState(1.4);
  const [deflectionAngle, setDeflectionAngle] = useState(2);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  // Numerical method to solve for sigma using Newton-Raphson
  const solveForSigma = (M1, gamma, delta_deg) => {
    const delta_rad = (delta_deg * Math.PI) / 180;
    const tan_delta = Math.tan(delta_rad);
    
    // Initial guess for sigma (in radians) - use weak shock angle
    let sigma = Math.asin(1 / M1) + 0.1; // Slightly above weak shock angle
    
    // Newton-Raphson iteration
    for (let i = 0; i < 200; i++) {
      const sin_2sigma = Math.sin(2 * sigma);
      const cos_2sigma = Math.cos(2 * sigma);
      const cot_sigma = 1 / Math.tan(sigma);
      
      // Function: f(sigma) = tan(delta) - (M1²sin(2σ) - 2cot(σ)) / (2 + M1²(γ + cos(2σ)))
      const numerator = M1 * M1 * sin_2sigma - 2 * cot_sigma;
      const denominator = 2 + M1 * M1 * (gamma + cos_2sigma);
      const f_sigma = tan_delta - numerator / denominator;
      
      // Check for convergence
      if (Math.abs(f_sigma) < 1e-10) break;
      
      // Derivative calculation
      const d_sin_2sigma = 2 * Math.cos(2 * sigma);
      const d_cos_2sigma = -2 * Math.sin(2 * sigma);
      const d_cot_sigma = -1 / (Math.sin(sigma) * Math.sin(sigma));
      
      const d_numerator = M1 * M1 * d_sin_2sigma - 2 * d_cot_sigma;
      const d_denominator = M1 * M1 * d_cos_2sigma;
      const d_f_sigma = -(d_numerator * denominator - numerator * d_denominator) / (denominator * denominator);
      
      if (Math.abs(d_f_sigma) < 1e-12) break;
      
      const sigma_new = sigma - f_sigma / d_f_sigma;
      
      // Ensure sigma is in valid range for oblique shocks
      if (sigma_new < Math.asin(1 / M1)) {
        sigma = Math.asin(1 / M1) + 0.01;
      } else if (sigma_new > Math.PI / 2) {
        sigma = Math.PI / 2 - 0.01;
      } else {
        sigma = sigma_new;
      }
      
      // Check for convergence
      if (Math.abs(sigma_new - sigma) < 1e-10) break;
    }
    
    return sigma;
  };

  const calculateObliqueShock = () => {
    if (!m1 || isNaN(parseFloat(m1)) || parseFloat(m1) <= 1) {
      setError("Please enter a valid Mach number (M₁ &gt; 1 for oblique shocks)");
      return;
    }

    const M1 = parseFloat(m1);
    const gamma_val = gamma;
    const delta_deg = deflectionAngle;

    if (M1 <= 1) {
      setError("Mach number must be greater than 1 for oblique shock waves");
      return;
    }

    setIsCalculating(true);
    setError("");

    try {
      // Solve for sigma using numerical method
      const sigma_rad = solveForSigma(M1, gamma_val, delta_deg);
      const sigma_deg = (sigma_rad * 180) / Math.PI;

      // Verify the solution by checking if it satisfies the formula
      const delta_rad = (delta_deg * Math.PI) / 180;
      const tan_delta = Math.tan(delta_rad);
      
      const sin_2sigma = Math.sin(2 * sigma_rad);
      const cos_2sigma = Math.cos(2 * sigma_rad);
      const cot_sigma = 1 / Math.tan(sigma_rad);
      
      const numerator = M1 * M1 * sin_2sigma - 2 * cot_sigma;
      const denominator = 2 + M1 * M1 * (gamma_val + cos_2sigma);
      const calculated_tan_delta = numerator / denominator;
      
      const error_percent = Math.abs((calculated_tan_delta - tan_delta) / tan_delta) * 100;

      setResults({
        M1: M1,
        gamma: gamma_val,
        deflection_angle_deg: delta_deg,
        sigma_deg: sigma_deg,
        sigma_rad: sigma_rad,
        verification_error: error_percent
      });
    } catch (err) {
      setError("Error in calculation. Please check your input values.");
    } finally {
      setIsCalculating(false);
    }
  };

  const resetCalculator = () => {
    setM1("");
    setGamma(1.4);
    setDeflectionAngle(2);
    setResults(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-12">
        {/* Theme Toggle Button */}
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            Wave angles for given deflection
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Oblique Shock Angle Calculator - Find σ using deflection angle formula
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Input Section */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Zap className="w-6 h-6" />
                Input Parameters
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Enter Mach number to calculate oblique shock wave properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="m1" className="text-base font-medium text-gray-700 dark:text-gray-300">
                  Upstream Mach Number (M₁)
                </Label>
                <Input
                  id="m1"
                  type="number"
                  step="0.01"
                  min="1.01"
                  placeholder="Enter M₁ (must be &gt; 1 for oblique shocks)"
                  value={m1}
                  onChange={(e) => setM1(e.target.value)}
                  className="text-lg"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Mach number must be greater than 1 for oblique shock waves
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
                  onChange={(e) => setGamma(parseFloat(e.target.value) || 1.4)}
                  className="text-lg"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Default value: 1.4 (typical for air at standard conditions)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deflection" className="text-base font-medium text-gray-700 dark:text-gray-300">
                  Deflection Angle (δ) [degrees]
                </Label>
                <Input
                  id="deflection"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="45"
                  value={deflectionAngle}
                  onChange={(e) => setDeflectionAngle(parseFloat(e.target.value) || 2)}
                  className="text-lg"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Default value: 2° (typical for small deflection angles)
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-md">
                  <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={calculateObliqueShock}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                  disabled={!m1 || isCalculating}
                >
                  {isCalculating ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate Shock Angle
                    </>
                  )}
                </Button>
                <Button 
                  onClick={resetCalculator}
                  variant="outline"
                  className="border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
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
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-violet-200 dark:border-violet-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                Oblique Shock Results
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Calculated shock angle (σ) using deflection angle formula
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Upstream Mach Number</p>
                      <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">{results.M1.toFixed(3)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Deflection Angle</p>
                      <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">{results.deflection_angle_deg.toFixed(1)}°</p>
                    </div>
                  </div>

                  {/* Main Result - Sigma */}
                  <div className="p-6 bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 rounded-lg border-2 border-purple-300 dark:border-purple-600">
                    <p className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">Shock Angle (σ)</p>
                    <p className="text-4xl font-bold text-purple-900 dark:text-purple-100">{results.sigma_deg.toFixed(4)}°</p>
                    <p className="text-xs text-purple-600 dark:text-purple-300 mt-1">
                      ({results.sigma_rad.toFixed(6)} radians)
                    </p>
                  </div>

                  {/* Verification */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Solution Verification</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      Error: {results.verification_error.toFixed(6)}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Lower values indicate better accuracy
                    </p>
                  </div>

                  {/* Formula Display */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                    <p className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">Deflection Angle Formula:</p>
                    <p className="text-sm text-purple-700 dark:text-purple-300 font-mono">
                      tan δ = (M₁² sin 2σ - 2 cot σ) / (2 + M₁²(γ + cos 2σ))
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                      Where: δ = {results.deflection_angle_deg.toFixed(1)}°, M₁ = {results.M1.toFixed(3)}, γ = {results.gamma}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Enter upstream Mach number (M₁ &gt; 1) and click Calculate to see oblique shock results
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
