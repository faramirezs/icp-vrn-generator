// Frontend TypeScript interfaces for Random Number History
// These interfaces mirror the backend Rust structs but use JavaScript-compatible types

export interface CallContext {
  caller_principal: string | null;
  execution_round: number;
  canister_version: number;
  cycles_consumed: number;
}

export interface RandomNumberEntry {
  number: bigint;
  timestamp: number; // IC timestamp in nanoseconds
  sequence_id: number;
  call_context: CallContext;
}

export interface SequenceIntegrityStatus {
  is_valid: boolean;
  total_entries: number;
  expected_sequence_range: [number, number]; // [min, max]
  detected_gaps: number[]; // sequence IDs that are missing
  error_message: string | null;
}

// Utility type for API responses
export type HistoryApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

// Helper functions for type conversion from backend bigint types
export const convertRandomNumberEntry = (
  backendEntry: any,
): RandomNumberEntry => ({
  number: BigInt(backendEntry.number),
  timestamp: Number(backendEntry.timestamp),
  sequence_id: Number(backendEntry.sequence_id),
  call_context: {
    caller_principal: backendEntry.call_context.caller_principal[0] || null,
    execution_round: Number(backendEntry.call_context.execution_round),
    canister_version: Number(backendEntry.call_context.canister_version),
    cycles_consumed: Number(backendEntry.call_context.cycles_consumed),
  },
});

export const convertSequenceIntegrityStatus = (
  backendStatus: any,
): SequenceIntegrityStatus => ({
  is_valid: backendStatus.is_valid,
  total_entries: Number(backendStatus.total_entries),
  expected_sequence_range: [
    Number(backendStatus.expected_sequence_range[0]),
    Number(backendStatus.expected_sequence_range[1]),
  ],
  detected_gaps: backendStatus.detected_gaps.map((gap: any) => Number(gap)),
  error_message: backendStatus.error_message[0] || null,
});

// Utility function to format timestamp for display
export const formatTimestamp = (timestamp: number): string => {
  // Convert nanoseconds to milliseconds for JavaScript Date
  const date = new Date(Math.floor(timestamp / 1_000_000));
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};
