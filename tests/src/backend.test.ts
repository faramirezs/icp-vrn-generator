import { describe, beforeEach, afterEach, it, expect, inject } from "vitest";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { PocketIc, type Actor } from "@dfinity/pic";
import { Principal } from "@dfinity/principal";

// Import generated types for your canister
import {
  type _SERVICE,
  idlFactory,
} from "../../src/declarations/backend/backend.did.js";

// Define the path to your canister's WASM file
export const WASM_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "target",
  "wasm32-unknown-unknown",
  "release",
  "backend.wasm",
);

// The `describe` function is used to group tests together
describe("Vibe Coding Template Backend", () => {
  // Define variables to hold our PocketIC instance, canister ID,
  // and an actor to interact with our canister.
  let pic: PocketIc;
  // @ts-ignore - This variable is used in the setup / framework
  let canisterId: Principal;
  let actor: Actor<_SERVICE>;

  // The `beforeEach` hook runs before each test.
  beforeEach(async () => {
    // create a new PocketIC instance
    pic = await PocketIc.create(inject("PIC_URL"));

    // Setup the canister and actor
    const fixture = await pic.setupCanister<_SERVICE>({
      idlFactory,
      wasm: WASM_PATH,
    });

    // Save the actor and canister ID for use in tests
    actor = fixture.actor;
    canisterId = fixture.canisterId;
  });

  // The `afterEach` hook runs after each test.
  afterEach(async () => {
    // tear down the PocketIC instance
    await pic.tearDown();
  });

  // The `it` function is used to define individual tests
  it("should greet with the provided name", async () => {
    const response = await actor.greet("World");
    expect(response).toEqual("Hello, World!");
  });

  it("should increment counter and return new value", async () => {
    const initialCount = await actor.get_count();
    const newCount = await actor.increment();
    expect(newCount).toEqual(initialCount + BigInt(1));
  });

  it("should get current counter value", async () => {
    const count = await actor.get_count();
    expect(typeof count).toBe("bigint");
  });

  it("should set counter to specified value", async () => {
    const newValue = BigInt(42);
    const result = await actor.set_count(newValue);
    expect(result).toEqual(newValue);
    const currentCount = await actor.get_count();
    expect(currentCount).toEqual(newValue);
  });

  it("should generate random numbers successfully", async () => {
    // Test that the function exists and is callable
    expect(typeof actor.generate_random_number).toBe("function");

    try {
      const result = await actor.generate_random_number();

      // Check that we get a successful result
      expect(result).toHaveProperty("Ok");
      expect(result).not.toHaveProperty("Err");

      if ("Ok" in result) {
        const randomNumber = result.Ok;
        expect(typeof randomNumber).toBe("bigint");
        expect(randomNumber).toBeGreaterThanOrEqual(BigInt(0));
        expect(randomNumber).toBeLessThanOrEqual(
          BigInt("18446744073709551615"),
        ); // u64 max
      }
    } catch (error) {
      // Catch any deployment or canister errors
      console.error("Random number generation failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `generate_random_number function failed: ${errorMessage}`,
      );
    }
  });

  it("should generate different random numbers on multiple calls", async () => {
    // Test that the function exists
    expect(typeof actor.generate_random_number).toBe("function");

    try {
      const results = await Promise.all([
        actor.generate_random_number(),
        actor.generate_random_number(),
        actor.generate_random_number(),
      ]);

      // All should be successful
      results.forEach((result, index) => {
        expect(result).toHaveProperty("Ok");
        if ("Err" in result) {
          throw new Error(`Call ${index + 1} failed with error: ${result.Err}`);
        }
      });

      // Extract the numbers
      const numbers = results.map((result) =>
        "Ok" in result ? result.Ok : null,
      );

      // Check that at least one number is different (extremely unlikely they're all the same)
      const uniqueNumbers = new Set(numbers.map((n) => n?.toString()));
      expect(uniqueNumbers.size).toBeGreaterThan(1);
    } catch (error) {
      console.error("Multiple random number generation failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `Multiple generate_random_number calls failed: ${errorMessage}`,
      );
    }
  });

  it("should properly export generate_random_number in Candid interface", async () => {
    // Check that the function is properly declared in the actor interface
    expect(actor.generate_random_number).toBeDefined();
    expect(typeof actor.generate_random_number).toBe("function");

    // Verify the function signature by checking it can be called
    const result = await actor.generate_random_number();
    expect(result).toHaveProperty("Ok");
  });
});
