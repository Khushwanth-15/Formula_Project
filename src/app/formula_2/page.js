"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Wind, RefreshCw, Calculator } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Formula2Page() {
  const [mx, setMx] = useState("");
  const [gamma, setGamma] = useState(1.3);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const calculateShockRelations = () => {
    if (!mx || isNaN(parseFloat(mx)) || parseFloat(mx) <= 1) {
      setError("Please enter a valid upstream Mach number (Mx > 1 for shock waves)");
      return;
    }

    const M_x = parseFloat(mx);
    const gamma_val = gamma;

    try {
      // Formula (4.1): T₀ₓ = T₀ᵧ (stagnation temperature conservation)
      // No calculation needed - this is a conservation law

      // Formula (4.2): Mᵧ = [ (2/(γ-1) + Mₓ²) / ( (2γ/(γ-1)) Mₓ² - 1 ) ]^(1/2)
      const numerator_My = (2 / (gamma_val - 1)) + (M_x * M_x);
      const denominator_My = ((2 * gamma_val) / (gamma_val - 1)) * (M_x * M_x) - 1;

      if (denominator_My <= 0) {
        setError("Invalid calculation: denominator for My is negative or zero");
        return;
      }

      const M_y = Math.sqrt(numerator_My / denominator_My);

      // Formula (4.3): Pᵧ/Pₓ = (2γ/(γ+1)) Mₓ² - (γ-1)/(γ+1)
      const Py_Px = ((2 * gamma_val) / (gamma_val + 1)) * (M_x * M_x) - ((gamma_val - 1) / (gamma_val + 1));

      // Formula (4.4): Tᵧ/Tₓ = (1 + (γ-1)/2 Mₓ²) / (1 + (γ-1)/2 Mᵧ²)
      const Ty_Tx = (1 + ((gamma_val - 1) / 2) * (M_x * M_x)) / (1 + ((gamma_val - 1) / 2) * (M_y * M_y));

      // Formula (4.5): aᵧ/aₓ = (Tᵧ/Tₓ)^(1/2)
      const ay_ax = Math.sqrt(Ty_Tx);

      // Formula (4.6): ρᵧ/ρₓ = (Pᵧ/Pₓ) * (Tₓ/Tᵧ)
      const rho_y_rho_x = Py_Px / Ty_Tx;

      // Formula (4.7): Pₓ/P₀ₓ = (1 + (γ-1)/2 Mₓ²)^(γ/(1-γ))
      const Px_P0x = Math.pow(1 + ((gamma_val - 1) / 2) * (M_x * M_x), gamma_val / (1 - gamma_val));

      // Formula (4.8): P₀ᵧ/Pᵧ = (1 + (γ-1)/2 Mᵧ²)^(γ/(γ-1))
      const P0y_Py = Math.pow(1 + ((gamma_val - 1) / 2) * (M_y * M_y), gamma_val / (gamma_val - 1));

      // Formula (4.9): P₀ᵧ/P₀ₓ = (P₀ᵧ/Pᵧ) * (Pᵧ/Pₓ) * (Pₓ/P₀ₓ)
      const P0y_P0x = P0y_Py * Py_Px * Px_P0x;

      // Formula (4.10): Δs/R = ln(P₀ₓ/P₀ᵧ)
      const delta_s_R = Math.log(P0y_P0x);

      // Formula (4.11): ρ₀ᵧ/ρₓ = (P₀ᵧ/Pᵧ) * (Pᵧ/Pₓ)
      const rho_0y_rho_x = P0y_Py * Py_Px;

      setResults({
        M_x: M_x,
        gamma: gamma_val,
        T0x_equals_T0y: "Conserved",
        M_y: M_y,
        Py_Px: Py_Px,
        Ty_Tx: Ty_Tx,
        ay_ax: ay_ax,
        rho_y_rho_x: rho_y_rho_x,
        Px_P0x: Px_P0x,
        P0y_Py: P0y_Py,
        P0y_P0x: P0y_P0x,
        delta_s_R: delta_s_R,
        rho_0y_rho_x: rho_0y_rho_x
      });
      setError("");
    } catch (err) {
      setError("Error in calculation. Please check your input values.");
    }
  };

  const resetCalculator = () => {
    setMx("");
    setGamma(1.3);
    setResults(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
      <div className="container mx-auto px-4 py-12">
        {/* Theme Toggle Button */}
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Normal shocks in perfect gases
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Normal Shock Wave Relations - Advanced Compressible Flow Calculations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Input Section */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-green-200 dark:border-green-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Wind className="w-6 h-6" />
                Input Parameters
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Enter the upstream Mach number to calculate all normal shock properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mx" className="text-base font-medium text-gray-700 dark:text-gray-300">
                  Upstream Mach Number (Mₓ)
                </Label>
                <Input
                  id="mx"
                  type="number"
                  step="0.01"
                  min="1.01"
                  placeholder="Enter Mₓ (must be &gt; 1 for shock waves)"
                  value={mx}
                  onChange={(e) => setMx(e.target.value)}
                  className="text-lg"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Mach number must be greater than 1 for normal shock waves
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
                  onClick={calculateShockRelations}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  disabled={!mx}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Shock Relations
                </Button>
                <Button
                  onClick={resetCalculator}
                  variant="outline"
                  className="border-green-300 dark:border-green-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
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
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-emerald-200 dark:border-emerald-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                Normal Shock Results
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                All calculated properties across the normal shock wave
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">Upstream Mach Number</p>
                      <p className="text-2xl font-bold text-green-800 dark:text-green-200">{results.M_x.toFixed(3)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">Specific Heat Ratio</p>
                      <p className="text-2xl font-bold text-green-800 dark:text-green-200">{results.gamma}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Stagnation Temperature Conservation</p>
                      <p className="text-lg font-bold text-gray-800 dark:text-gray-200">T₀ₓ = T₀ᵧ ({results.T0x_equals_T0y})</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Downstream Mach Number (Mᵧ)</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{results.M_y.toFixed(6)}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pressure Ratio (Pᵧ/Pₓ)</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{results.Py_Px.toFixed(6)}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Temperature Ratio (Tᵧ/Tₓ)</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{results.Ty_Tx.toFixed(6)}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Speed of Sound Ratio (aᵧ/aₓ)</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{results.ay_ax.toFixed(6)}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Density Ratio (ρᵧ/ρₓ)</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{results.rho_y_rho_x.toFixed(6)}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upstream Pressure Ratio (Pₓ/P₀ₓ)</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{results.Px_P0x.toFixed(6)}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Downstream Pressure Ratio (P₀ᵧ/Pᵧ)</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{results.P0y_Py.toFixed(6)}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Stagnation Pressure Ratio (P₀ᵧ/P₀ₓ)</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{results.P0y_P0x.toFixed(6)}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Entropy Change (Δs/R)</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{results.delta_s_R.toFixed(6)}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Density Ratio (ρ₀ᵧ/ρₓ)</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{results.rho_0y_rho_x.toFixed(6)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Enter upstream Mach number (Mₓ &gt; 1) and click Calculate to see normal shock results
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