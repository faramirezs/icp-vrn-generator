import { PocketIc } from "@dfinity/pic";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { idlFactory } from "./src/declarations/backend/backend.did.js";

// Quick test script to verify random number generation
async function testRandomGeneration() {
  console.log("🧪 Testing random number generation...");

  const pic = await PocketIc.create();

  const WASM_PATH = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "target",
    "wasm32-unknown-unknown",
    "release",
    "backend.wasm",
  );

  const { actor } = await pic.setupCanister({
    idlFactory,
    wasm: WASM_PATH,
  });

  // Generate 5 random numbers
  console.log("Generating 5 random numbers:");
  for (let i = 0; i < 5; i++) {
    const result = await actor.generate_random_number();
    if ("Ok" in result) {
      console.log(`${i + 1}. ${result.Ok.toString()}`);
    } else {
      console.log(`${i + 1}. Error: ${result.Err}`);
    }
  }

  await pic.tearDown();
  console.log("✅ Test completed!");
}

testRandomGeneration().catch(console.error);
