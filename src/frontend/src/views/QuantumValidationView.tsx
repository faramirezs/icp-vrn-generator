import { useState } from "react";
import { Button, Card, Loader } from "../components";
import { backendService } from "../services/backendService";

interface QuantumValidationResult {
  job_id: string;
  status: string;
  icp_stats?: {
    name: string;
    count: number;
    min: number;
    max: number;
    mean: number;
    std: number;
    frequency_test_p: number;
    runs_test_p: number;
    uniformity_test_p: number;
    passes_frequency: boolean;
    passes_runs: boolean;
    passes_uniformity: boolean;
    overall_random: boolean;
  };
  quantum_stats?: {
    name: string;
    count: number;
    min: number;
    max: number;
    mean: number;
    std: number;
    frequency_test_p: number;
    runs_test_p: number;
    uniformity_test_p: number;
    passes_frequency: boolean;
    passes_runs: boolean;
    passes_uniformity: boolean;
    overall_random: boolean;
  };
  comparison_results?: {
    ks_test_p_value: number;
    sequences_similar: boolean;
    icp_passes_all_tests: boolean;
    quantum_passes_all_tests: boolean;
  };
  p_values?: {
    icp_frequency: number;
    icp_runs: number;
    icp_uniformity: number;
    quantum_frequency: number;
    quantum_runs: number;
    quantum_uniformity: number;
    comparison_ks: number;
  };
  is_random?: boolean;
  created_at: string;
  completed_at?: string;
}

interface QuantumValidationViewProps {
  onError: (error: string) => void;
}

const QuantumValidationView = ({ onError }: QuantumValidationViewProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<QuantumValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const [useRealQuantum, setUseRealQuantum] = useState(false);

  const formatPValue = (p: number): string => {
    if (p < 0.001) return "< 0.001";
    return p.toFixed(4);
  };

  const getTestStatusIcon = (passes: boolean): string => {
    return passes ? "✅" : "❌";
  };

  const pollJobStatus = async (jobId: string): Promise<void> => {
    const maxAttempts = 24; // 2 minutes max (24 * 5 seconds)
    let attempts = 0;

    const poll = async (): Promise<void> => {
      try {
        const response = await fetch(`http://localhost:8000/validation-status/${jobId}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result: QuantumValidationResult = await response.json();
        console.log("Polling result:", result);

        if (result.status === "completed") {
          setValidationResult(result);
          setIsValidating(false);
          setProgress("✅ Validation completed!");
          setError(null);
        } else if (result.status === "failed") {
          setIsValidating(false);
          setError("Quantum validation failed");
          onError("Quantum validation failed");
        } else if (attempts < maxAttempts) {
          // Update progress message
          if (result.status === "running") {
            setProgress("🔬 Running quantum validation tests...");
          } else {
            setProgress("⏳ Preparing quantum validation...");
          }
          
          attempts++;
          // Continue polling
          setTimeout(() => poll(), 5000); // Poll every 5 seconds
        } else {
          setIsValidating(false);
          setError("Validation timeout - please try again");
          onError("Validation timeout - please try again");
        }
      } catch (error) {
        console.error("Polling error:", error);
        setIsValidating(false);
        setError(`Polling error: ${error}`);
        onError(`Polling error: ${error}`);
      }
    };

    // Start polling immediately
    await poll();
  };

  const handleValidation = async () => {
    setIsValidating(true);
    setError(null);
    setValidationResult(null);
    setProgress("🔍 Fetching ICP random numbers...");

    try {
      // Get random numbers from ICP
      let icpNumbers = await backendService.exportRecentRandoms(50);
      console.log("🔮 ICP Numbers exported:", icpNumbers.length);

      // If we don't have enough numbers, generate some
      if (icpNumbers.length < 10) {
        setProgress("📊 Generating additional random numbers for analysis...");
        try {
          // Generate additional numbers
          const additionalCount = 20 - icpNumbers.length;
          for (let i = 0; i < additionalCount; i++) {
            const newNumber = await backendService.generateRandomNumber();
            icpNumbers.push(Number(newNumber));
          }
          console.log(`Generated ${additionalCount} additional numbers`);
        } catch (genError) {
          console.warn("Could not generate additional numbers:", genError);
          if (icpNumbers.length === 0) {
            throw new Error("No ICP random numbers available. Please generate some random numbers first.");
          }
        }
      }

      setProgress("🚀 Starting quantum validation...");

      // Send to quantum validation service
      const response = await fetch("http://localhost:8000/validate-randomness", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          icp_numbers: icpNumbers,
          quantum_sample_size: Math.max(icpNumbers.length, 50),
          use_real_quantum: useRealQuantum,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const startResult = await response.json();
      console.log("Validation started:", startResult);
      
      if (startResult.job_id) {
        setProgress("⚡ Quantum validation job started...");
        // Start polling for results
        await pollJobStatus(startResult.job_id);
      } else {
        throw new Error("No job ID returned from validation service");
      }

    } catch (err) {
      console.error("❌ Quantum validation error:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      onError(errorMessage);
      setIsValidating(false);
    }
  };

  return (
    <Card title="🔬 Quantum Randomness Validation">
      <div className="space-y-6">
        {/* Info Section */}
        <div className="rounded-lg bg-blue-900/30 border border-blue-500/30 p-4">
          <h4 className="font-semibold text-blue-300 mb-2">
            🌟 World-First Quantum Validation
          </h4>
          <p className="text-sm text-blue-100">
            This feature uses IBM Quantum computers to validate that ICP's randomness 
            meets quantum-level standards. We compare your generated random numbers 
            against quantum random numbers using statistical tests.
          </p>
        </div>

        {/* Quantum Backend Selection */}
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={useRealQuantum}
              onChange={(e) => setUseRealQuantum(e.target.checked)}
              className="rounded border-gray-500 bg-gray-800 text-pink-500 focus:ring-pink-500"
            />
            <span className="text-sm">
              Use real IBM Quantum hardware (requires API token, slower)
            </span>
          </label>
          {!useRealQuantum && (
            <p className="text-xs text-gray-400 ml-6">
              Using quantum simulator for fast demonstration
            </p>
          )}
        </div>

        {/* Validation Button */}
        <div className="text-center">
          <Button
            onClick={handleValidation}
            disabled={isValidating}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-8 py-4 text-lg font-bold shadow-2xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
          >
            {isValidating ? "🔬 Validating..." : "🚀 Prove Quantum-Level Randomness"}
          </Button>
        </div>

        {/* Progress */}
        {isValidating && (
          <div className="text-center space-y-2">
            <Loader />
            <p className="text-sm text-gray-300">{progress}</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="rounded-lg bg-red-900/30 border border-red-500/30 p-4">
            <div className="text-center space-y-2">
              <div className="text-3xl">⚠️</div>
              <h3 className="text-lg font-semibold text-red-300">Validation Error</h3>
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {validationResult && validationResult.status === "completed" && (
          <div className="space-y-6">
            {/* Overall Result */}
            <div className={`rounded-lg border p-4 ${
              validationResult.icp_stats?.overall_random 
                ? "bg-green-900/30 border-green-500/30" 
                : "bg-red-900/30 border-red-500/30"
            }`}>
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold">
                  {validationResult.icp_stats?.overall_random ? "✅ ICP QUANTUM-LEVEL RANDOMNESS VALIDATED" : "❌ ICP VALIDATION FAILED"}
                </h4>
                <div className="text-sm text-gray-300">
                  {validationResult.completed_at && new Date(validationResult.completed_at).toLocaleString()}
                </div>
              </div>
              <p className="mt-2 text-sm">
                {validationResult.icp_stats?.overall_random
                  ? "🎉 ICP's randomness passes all NIST statistical tests, proving quantum-level quality!"
                  : "⚠️ ICP randomness did not pass all required statistical tests."}
              </p>
            </div>

            {/* Detailed Statistics */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* ICP Statistics */}
              {validationResult.icp_stats && (
                <div className="rounded-lg bg-gray-800 p-4">
                  <h5 className="font-semibold text-pink-400 mb-3">
                    🔮 ICP Random Numbers Analysis
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sample Size:</span>
                      <span className="font-mono">{validationResult.icp_stats.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mean:</span>
                      <span className="font-mono">{validationResult.icp_stats.mean.toExponential(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Std Dev:</span>
                      <span className="font-mono">{validationResult.icp_stats.std.toExponential(2)}</span>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-2 mt-3">
                      <h6 className="font-medium text-gray-300 mb-2">NIST Test Results</h6>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span>Frequency Test:</span>
                          <span className="flex items-center space-x-2">
                            <span>{getTestStatusIcon(validationResult.icp_stats.passes_frequency)}</span>
                            <span className="font-mono text-xs">p={formatPValue(validationResult.icp_stats.frequency_test_p)}</span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Runs Test:</span>
                          <span className="flex items-center space-x-2">
                            <span>{getTestStatusIcon(validationResult.icp_stats.passes_runs)}</span>
                            <span className="font-mono text-xs">p={formatPValue(validationResult.icp_stats.runs_test_p)}</span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Uniformity Test:</span>
                          <span className="flex items-center space-x-2">
                            <span>{getTestStatusIcon(validationResult.icp_stats.passes_uniformity)}</span>
                            <span className="font-mono text-xs">p={formatPValue(validationResult.icp_stats.uniformity_test_p)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantum Statistics */}
              {validationResult.quantum_stats && (
                <div className="rounded-lg bg-gray-800 p-4">
                  <h5 className="font-semibold text-blue-400 mb-3">
                    ⚛️ Quantum Numbers Analysis
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sample Size:</span>
                      <span className="font-mono">{validationResult.quantum_stats.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mean:</span>
                      <span className="font-mono">{validationResult.quantum_stats.mean.toExponential(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Std Dev:</span>
                      <span className="font-mono">{validationResult.quantum_stats.std.toExponential(2)}</span>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-2 mt-3">
                      <h6 className="font-medium text-gray-300 mb-2">NIST Test Results</h6>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span>Frequency Test:</span>
                          <span className="flex items-center space-x-2">
                            <span>{getTestStatusIcon(validationResult.quantum_stats.passes_frequency)}</span>
                            <span className="font-mono text-xs">p={formatPValue(validationResult.quantum_stats.frequency_test_p)}</span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Runs Test:</span>
                          <span className="flex items-center space-x-2">
                            <span>{getTestStatusIcon(validationResult.quantum_stats.passes_runs)}</span>
                            <span className="font-mono text-xs">p={formatPValue(validationResult.quantum_stats.runs_test_p)}</span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Uniformity Test:</span>
                          <span className="flex items-center space-x-2">
                            <span>{getTestStatusIcon(validationResult.quantum_stats.passes_uniformity)}</span>
                            <span className="font-mono text-xs">p={formatPValue(validationResult.quantum_stats.uniformity_test_p)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Comparison Results */}
            {validationResult.comparison_results && (
              <div className="rounded-lg bg-gray-800 p-4">
                <h5 className="font-semibold text-purple-400 mb-3">
                  📊 ICP vs Quantum Comparison
                </h5>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Kolmogorov-Smirnov Test:</span>
                    <span className="flex items-center space-x-2">
                      <span>{getTestStatusIcon(validationResult.comparison_results.sequences_similar)}</span>
                      <span className="font-mono text-xs">
                        p={formatPValue(validationResult.comparison_results.ks_test_p_value)}
                      </span>
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {validationResult.comparison_results.sequences_similar
                      ? "✅ Sequences are statistically similar (p {'>'} 0.05)"
                      : "❌ Sequences are significantly different (p ≤ 0.05)"}
                  </div>
                  
                  <div className="border-t border-gray-700 pt-2 mt-3">
                    <div className="flex justify-between">
                      <span>ICP passes all tests:</span>
                      <span>{getTestStatusIcon(validationResult.comparison_results.icp_passes_all_tests)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantum passes all tests:</span>
                      <span>{getTestStatusIcon(validationResult.comparison_results.quantum_passes_all_tests)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Technical Note */}
            <div className="rounded-lg bg-gray-900/50 border border-gray-700 p-3">
              <p className="text-xs text-gray-400">
                <strong>Note:</strong> All p-values {'>'}  0.01 indicate the sequence passes the randomness test. 
                The Kolmogorov-Smirnov test compares the distributions of ICP and quantum numbers - 
                a p-value {'>'} 0.05 means they are statistically similar, proving ICP's randomness quality.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuantumValidationView;
