import { backend } from "../../../declarations/backend";
import {
  RandomNumberEntry,
  SequenceIntegrityStatus,
  convertRandomNumberEntry,
  convertSequenceIntegrityStatus,
  HistoryApiResponse,
} from "../types/history";

/**
 * Service for handling all backend canister API calls
 */
export const backendService = {
  /**
   * Sends a greeting to the backend and returns the response
   * @param name Name to greet
   * @returns Promise with the greeting response
   */
  async greet(name: string): Promise<string> {
    return await backend.greet(name || "World");
  },

  /**
   * Fetches the current counter value
   * @returns Promise with the current count
   */
  async getCount(): Promise<bigint> {
    return await backend.get_count();
  },

  /**
   * Increments the counter on the backend
   * @returns Promise with the new count
   */
  async incrementCounter(): Promise<bigint> {
    return await backend.increment();
  },

  /**
   * Sends a prompt to the LLM backend
   * @param prompt The user's prompt text
   * @returns Promise with the LLM response
   */
  async sendLlmPrompt(prompt: string): Promise<string> {
    return await backend.prompt(prompt);
  },

  /**
   * Generates a cryptographically secure random number
   * @returns Promise with the generated random number
   */
  async generateRandomNumber(): Promise<bigint> {
    const result = await backend.generate_random_number();
    if ("Ok" in result) {
      return result.Ok;
    } else {
      throw new Error(result.Err);
    }
  },

  /**
   * Fetches the complete random number history
   * @returns Promise with the history entries (most recent first)
   */
  async getRandomHistory(): Promise<HistoryApiResponse<RandomNumberEntry[]>> {
    try {
      const backendEntries = await backend.get_random_history();
      const convertedEntries = backendEntries.map(convertRandomNumberEntry);
      return {
        success: true,
        data: convertedEntries,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch history",
      };
    }
  },

  /**
   * Gets the current count of history entries
   * @returns Promise with the count of stored entries
   */
  async getHistoryCount(): Promise<HistoryApiResponse<number>> {
    try {
      const count = await backend.get_history_count();
      return {
        success: true,
        data: Number(count),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch history count",
      };
    }
  },

  /**
   * Verifies the integrity of the sequence numbers in the history
   * @returns Promise with the integrity status
   */
  async verifySequenceIntegrity(): Promise<
    HistoryApiResponse<SequenceIntegrityStatus>
  > {
    try {
      const backendStatus = await backend.verify_sequence_integrity();
      const convertedStatus = convertSequenceIntegrityStatus(backendStatus);
      return {
        success: true,
        data: convertedStatus,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to verify sequence integrity",
      };
    }
  },
};
