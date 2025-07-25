import { useState } from "react";
import { Button, Card } from "../components";
import { backendService } from "../services/backendService";

interface RandomGeneratorViewProps {
  onError: (error: string) => void;
  setLoading: (loading: boolean) => void;
}

/**
 * RandomGeneratorView component for generating cryptographically secure random numbers
 */
export function RandomGeneratorView({
  onError,
  setLoading,
}: RandomGeneratorViewProps) {
  const [randomNumber, setRandomNumber] = useState<bigint | null>(null);

  const handleGenerateNumber = async () => {
    try {
      setLoading(true);
      const res = await backendService.generateRandomNumber();
      setRandomNumber(res);
    } catch (err) {
      console.error(err);
      onError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Random Number Generator">
      <div className="space-y-4">
        {/* Generate Button */}
        <div className="text-center">
          <Button
            onClick={handleGenerateNumber}
            className="px-8 py-4 text-lg font-semibold"
          >
            Generate Random Number
          </Button>
        </div>

        {/* Display Area for Generated Number */}
        {randomNumber !== null && (
          <div className="mt-6 rounded bg-gray-700 p-4">
            <h4 className="mb-2 text-sm font-medium text-gray-300">
              Generated Number:
            </h4>
            <div className="font-mono text-2xl font-bold break-all text-white">
              {randomNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Cryptographically secure • {randomNumber.toString().length} digits
            </div>
          </div>
        )}

        {/* Placeholder when no number generated */}
        {randomNumber === null && (
          <div className="mt-6 rounded bg-gray-800 p-4 text-center text-gray-400">
            Click the button above to generate a cryptographically secure random
            number
          </div>
        )}
      </div>
    </Card>
  );
}
