import { useState } from "react";
import { Button, Card } from "../components";
import { backendService } from "../services/backendService";
import { RandomNumberEntry } from "../types/history";

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
  const [history, setHistory] = useState<RandomNumberEntry[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [expandedEntries, setExpandedEntries] = useState<Set<number>>(
    new Set(),
  );

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await backendService.getRandomHistory();
      if (response.success) {
        setHistory(response.data);
      } else {
        onError(`Failed to load history: ${response.error}`);
      }
    } catch (err) {
      console.error("Error loading history:", err);
      onError(String(err));
    } finally {
      setHistoryLoading(false);
    }
  };

  const toggleHistory = async () => {
    if (!isHistoryOpen && history.length === 0) {
      await loadHistory();
    }
    setIsHistoryOpen(!isHistoryOpen);
  };

  const toggleEntryExpansion = (sequenceId: number) => {
    setExpandedEntries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sequenceId)) {
        newSet.delete(sequenceId);
      } else {
        newSet.add(sequenceId);
      }
      return newSet;
    });
  };

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

        {/* History Section */}
        <div className="mt-8 border-t border-gray-600 pt-6">
          <Button
            onClick={toggleHistory}
            className="flex w-full items-center justify-between rounded bg-gray-700 px-4 py-3 text-left hover:bg-gray-600"
          >
            <span className="font-medium">
              History {history.length > 0 && `(${history.length} entries)`}
            </span>
            <span className="text-gray-400">{isHistoryOpen ? "▼" : "▶"}</span>
          </Button>

          {isHistoryOpen && (
            <div className="mt-4 rounded bg-gray-800 p-4">
              {historyLoading ? (
                <div className="py-4 text-center text-gray-400">
                  Loading history...
                </div>
              ) : history.length === 0 ? (
                <div className="py-4 text-center text-gray-400">
                  No history available. Generate some random numbers to see them
                  here.
                </div>
              ) : (
                <div className="max-h-80 space-y-2 overflow-y-auto">
                  {history.map((entry) => {
                    const isExpanded = expandedEntries.has(entry.sequence_id);
                    return (
                      <div
                        key={entry.sequence_id}
                        className="rounded bg-gray-700 text-sm"
                      >
                        {/* Main Entry Display */}
                        <div
                          className="flex cursor-pointer items-center justify-between p-3 transition-colors hover:bg-gray-600"
                          onClick={() =>
                            toggleEntryExpansion(entry.sequence_id)
                          }
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xs text-gray-400">
                              {isExpanded ? "▼" : "▶"}
                            </span>
                            <div className="font-mono">
                              Seq #{entry.sequence_id}:{" "}
                              {entry.number
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            Generated:{" "}
                            {new Date(
                              Number(entry.timestamp) / 1_000_000,
                            ).toLocaleString()}
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="space-y-2 border-t border-gray-600 bg-gray-800 p-3">
                            <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
                              {/* Call Context Details */}
                              <div>
                                <h5 className="mb-2 font-semibold text-gray-300">
                                  Call Context
                                </h5>
                                <div className="space-y-1">
                                  <div>
                                    <span className="text-gray-400">
                                      Caller Principal:
                                    </span>
                                    <div className="font-mono break-all text-gray-200">
                                      {entry.call_context.caller_principal ||
                                        "Anonymous"}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">
                                      Execution Round:
                                    </span>
                                    <span className="ml-1 text-gray-200">
                                      {entry.call_context.execution_round}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">
                                      Canister Version:
                                    </span>
                                    <span className="ml-1 text-gray-200">
                                      {entry.call_context.canister_version}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">
                                      Cycles Consumed:
                                    </span>
                                    <span className="ml-1 text-gray-200">
                                      {entry.call_context.cycles_consumed.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Audit Metadata */}
                              <div>
                                <h5 className="mb-2 font-semibold text-gray-300">
                                  Audit Metadata
                                </h5>
                                <div className="space-y-1">
                                  <div>
                                    <span className="text-gray-400">
                                      Timestamp (NS):
                                    </span>
                                    <div className="font-mono text-gray-200">
                                      {entry.timestamp.toString()}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">
                                      Raw Number:
                                    </span>
                                    <div className="font-mono break-all text-gray-200">
                                      {entry.number.toString()}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">
                                      Entry Size:
                                    </span>
                                    <span className="ml-1 text-gray-200">
                                      {JSON.stringify(entry).length} bytes
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
