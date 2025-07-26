import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { RandomGeneratorView } from "../../src/views/RandomGeneratorView";
import { StrictMode } from "react";
import userEvent from "@testing-library/user-event";

// Mock the backendService
vi.mock("../../src/services/backendService", () => ({
  backendService: {
    generateRandomNumber: vi
      .fn()
      .mockResolvedValue(BigInt("12345678901234567890")),
    getRandomHistory: vi.fn().mockResolvedValue({
      success: true,
      data: [],
    }),
  },
}));

describe("RandomGeneratorView", () => {
  const mockOnError = vi.fn();
  const mockSetLoading = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();
    // Reset the mock implementation to the default resolved value
    const { backendService } = await import(
      "../../src/services/backendService"
    );
    vi.mocked(backendService.generateRandomNumber).mockResolvedValue(
      BigInt("12345678901234567890"),
    );
    vi.mocked(backendService.getRandomHistory).mockResolvedValue({
      success: true,
      data: [],
    });
  });

  it("should render the random number generator with button and placeholder text", () => {
    // Setup
    render(
      <StrictMode>
        <RandomGeneratorView
          onError={mockOnError}
          setLoading={mockSetLoading}
        />
      </StrictMode>,
    );

    // Assert
    expect(screen.getByText("Generate Random Number")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Click the button above to generate a cryptographically secure random number",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Generate Random Number")).toBeInTheDocument();
  });

  it("should call the generateRandomNumber service and display the result when button is clicked", async () => {
    // Setup
    render(
      <StrictMode>
        <RandomGeneratorView
          onError={mockOnError}
          setLoading={mockSetLoading}
        />
      </StrictMode>,
    );

    // Execute
    const button = screen.getByText("Generate Random Number");
    await userEvent.click(button);

    // Assert
    const { backendService } = await import(
      "../../src/services/backendService"
    );
    expect(backendService.generateRandomNumber).toHaveBeenCalledTimes(1);

    // Check that the number is displayed with proper formatting
    expect(screen.getByText("12,345,678,901,234,567,890")).toBeInTheDocument();
    expect(screen.getByText("Generated Number:")).toBeInTheDocument();
    expect(
      screen.getByText(/Cryptographically secure • \d+ digits/),
    ).toBeInTheDocument();
  });

  it("should manage loading state properly during random number generation", async () => {
    // Setup
    render(
      <StrictMode>
        <RandomGeneratorView
          onError={mockOnError}
          setLoading={mockSetLoading}
        />
      </StrictMode>,
    );

    // Execute
    const button = screen.getByText("Generate Random Number");
    await userEvent.click(button);

    // Assert loading state management
    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it("should handle errors properly when random number generation fails", async () => {
    // Setup - Mock service to reject
    const { backendService } = await import(
      "../../src/services/backendService"
    );
    vi.mocked(backendService.generateRandomNumber).mockRejectedValue(
      new Error("Failed to generate random number"),
    );

    render(
      <StrictMode>
        <RandomGeneratorView
          onError={mockOnError}
          setLoading={mockSetLoading}
        />
      </StrictMode>,
    );

    // Execute
    const button = screen.getByText("Generate Random Number");
    await userEvent.click(button);

    // Assert error handling
    expect(mockOnError).toHaveBeenCalledWith(
      "Error: Failed to generate random number",
    );
    expect(mockSetLoading).toHaveBeenCalledWith(false); // Should reset loading state
  });

  it("should display placeholder text when no number has been generated", () => {
    // Setup
    render(
      <StrictMode>
        <RandomGeneratorView
          onError={mockOnError}
          setLoading={mockSetLoading}
        />
      </StrictMode>,
    );

    // Assert
    expect(
      screen.getByText(
        "Click the button above to generate a cryptographically secure random number",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("Generated Number:")).not.toBeInTheDocument();
  });

  it("should not display placeholder text after a number is generated", async () => {
    // Setup
    render(
      <StrictMode>
        <RandomGeneratorView
          onError={mockOnError}
          setLoading={mockSetLoading}
        />
      </StrictMode>,
    );

    // Execute - click the button to generate a number
    const button = screen.getByText("Generate Random Number");
    await userEvent.click(button);

    // Assert - verify the service was called
    const { backendService } = await import(
      "../../src/services/backendService"
    );
    expect(backendService.generateRandomNumber).toHaveBeenCalled();

    // Assert - the formatted number should be displayed
    expect(screen.getByText("12,345,678,901,234,567,890")).toBeInTheDocument();
    expect(screen.getByText("Generated Number:")).toBeInTheDocument();

    // Assert - placeholder text should not be present
    expect(
      screen.queryByText(
        "Click the button above to generate a cryptographically secure random number",
      ),
    ).not.toBeInTheDocument();
  });

  // Additional tests for Task 4.2: Button click behavior and loading states
  it("should call setLoading with true immediately when button is clicked", async () => {
    // Setup
    render(
      <StrictMode>
        <RandomGeneratorView
          onError={mockOnError}
          setLoading={mockSetLoading}
        />
      </StrictMode>,
    );

    // Execute
    const button = screen.getByText("Generate Random Number");
    await userEvent.click(button);

    // Assert that setLoading(true) is called first
    expect(mockSetLoading).toHaveBeenNthCalledWith(1, true);
  });

  it("should call setLoading with false after successful generation", async () => {
    // Setup
    render(
      <StrictMode>
        <RandomGeneratorView
          onError={mockOnError}
          setLoading={mockSetLoading}
        />
      </StrictMode>,
    );

    // Execute
    const button = screen.getByText("Generate Random Number");
    await userEvent.click(button);

    // Assert that setLoading(false) is called after success
    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
    expect(mockSetLoading).toHaveBeenCalledTimes(2);
  });

  it("should call setLoading with false after error occurs", async () => {
    // Setup - Mock service to reject
    const { backendService } = await import(
      "../../src/services/backendService"
    );
    vi.mocked(backendService.generateRandomNumber).mockRejectedValue(
      new Error("Network error"),
    );

    render(
      <StrictMode>
        <RandomGeneratorView
          onError={mockOnError}
          setLoading={mockSetLoading}
        />
      </StrictMode>,
    );

    // Execute
    const button = screen.getByText("Generate Random Number");
    await userEvent.click(button);

    // Assert that setLoading(false) is called even after error
    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
    expect(mockSetLoading).toHaveBeenCalledTimes(2);
    expect(mockOnError).toHaveBeenCalledWith("Error: Network error");
  });

  it("should allow multiple button clicks to generate different numbers", async () => {
    // Setup
    const { backendService } = await import(
      "../../src/services/backendService"
    );
    vi.mocked(backendService.generateRandomNumber)
      .mockResolvedValueOnce(BigInt("11111111111111111111"))
      .mockResolvedValueOnce(BigInt("22222222222222222222"));

    render(
      <StrictMode>
        <RandomGeneratorView
          onError={mockOnError}
          setLoading={mockSetLoading}
        />
      </StrictMode>,
    );

    // Execute - first click
    const button = screen.getByText("Generate Random Number");
    await userEvent.click(button);

    // Assert first number
    expect(screen.getByText("11,111,111,111,111,111,111")).toBeInTheDocument();

    // Execute - second click
    await userEvent.click(button);

    // Assert second number (should replace first)
    expect(screen.getByText("22,222,222,222,222,222,222")).toBeInTheDocument();
    expect(
      screen.queryByText("11,111,111,111,111,111,111"),
    ).not.toBeInTheDocument();

    // Assert service called twice
    expect(backendService.generateRandomNumber).toHaveBeenCalledTimes(2);
  });

  it("should have accessible button with proper role and text", () => {
    // Setup
    render(
      <StrictMode>
        <RandomGeneratorView
          onError={mockOnError}
          setLoading={mockSetLoading}
        />
      </StrictMode>,
    );

    // Assert button accessibility
    const button = screen.getByRole("button", {
      name: "Generate Random Number",
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Generate Random Number");
  });

  it("should maintain proper loading state sequence during operation", async () => {
    // Setup
    render(
      <StrictMode>
        <RandomGeneratorView
          onError={mockOnError}
          setLoading={mockSetLoading}
        />
      </StrictMode>,
    );

    // Execute
    const button = screen.getByText("Generate Random Number");
    await userEvent.click(button);

    // Assert loading states were called in correct order
    expect(mockSetLoading).toHaveBeenCalledTimes(2);
    expect(mockSetLoading).toHaveBeenNthCalledWith(1, true);
    expect(mockSetLoading).toHaveBeenNthCalledWith(2, false);
  });

  it("should refresh history when generating a number while history is open", async () => {
    // Setup
    const { backendService } = await import(
      "../../src/services/backendService"
    );

    render(
      <StrictMode>
        <RandomGeneratorView
          onError={mockOnError}
          setLoading={mockSetLoading}
          loading={false}
        />
      </StrictMode>,
    );

    // Execute - open history first
    const historyButton = screen.getByText(/History/);
    await userEvent.click(historyButton);

    // Verify history was loaded when opened
    expect(backendService.getRandomHistory).toHaveBeenCalledTimes(1);

    // Execute - generate a new number while history is open
    const generateButton = screen.getByText("Generate Random Number");
    await userEvent.click(generateButton);

    // Assert - both services should be called
    expect(backendService.generateRandomNumber).toHaveBeenCalledTimes(1);
    expect(backendService.getRandomHistory).toHaveBeenCalledTimes(2); // Once for opening, once for refresh
  });
});
