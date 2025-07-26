use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::export_candid;
use std::cell::RefCell;

use ic_llm::{ChatMessage, Model};

// Data structures for random number history tracking and auditing
#[derive(Clone, Debug, serde::Serialize, serde::Deserialize, candid::CandidType)]
pub struct RandomNumberEntry {
    pub number: u64,
    pub timestamp: u64,
    pub sequence_id: u64,
    pub call_context: CallContext,
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize, candid::CandidType)]
pub struct CallContext {
    pub caller_principal: Option<String>,
    pub execution_round: u64,
    pub canister_version: u64,
    pub cycles_consumed: u64,
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize, candid::CandidType)]
pub struct SequenceIntegrityStatus {
    pub is_valid: bool,
    pub total_entries: u64,
    pub expected_sequence_range: (u64, u64), // (min, max)
    pub detected_gaps: Vec<u64>,             // sequence IDs that are missing
    pub error_message: Option<String>,
}

#[ic_cdk::update]
async fn prompt(prompt_str: String) -> String {
    ic_llm::prompt(Model::Llama3_1_8B, prompt_str).await
}

#[ic_cdk::update]
async fn chat(messages: Vec<ChatMessage>) -> String {
    let response = ic_llm::chat(Model::Llama3_1_8B)
        .with_messages(messages)
        .send()
        .await;

    // A response can contain tool calls, but we're not calling tools in this project,
    // so we can return the response message directly.
    response.message.content.unwrap_or_default()
}

thread_local! {
    static COUNTER: RefCell<u64> = const { RefCell::new(0) };
    static RANDOM_HISTORY: RefCell<Vec<RandomNumberEntry>> = const { RefCell::new(Vec::new()) };
    static SEQUENCE_COUNTER: RefCell<u64> = const { RefCell::new(0) };
}

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[ic_cdk::update]
fn increment() -> u64 {
    COUNTER.with(|counter| {
        let val = *counter.borrow() + 1;
        *counter.borrow_mut() = val;
        val
    })
}

#[ic_cdk::query]
fn get_count() -> u64 {
    COUNTER.with(|counter| *counter.borrow())
}

#[ic_cdk::update]
fn set_count(value: u64) -> u64 {
    COUNTER.with(|counter| {
        *counter.borrow_mut() = value;
        value
    })
}

#[ic_cdk::update]
async fn generate_random_number() -> Result<u64, String> {
    match raw_rand().await {
        Ok((random_bytes,)) => {
            // Convert the first 8 bytes to u64 for decimal display
            if random_bytes.len() < 8 {
                return Err("Insufficient random bytes received".to_string());
            }

            // Take the first 8 bytes and convert to u64
            let mut bytes = [0u8; 8];
            bytes.copy_from_slice(&random_bytes[0..8]);
            let random_number = u64::from_be_bytes(bytes);

            // Capture call context for audit trail
            let caller = ic_cdk::api::caller();
            let timestamp = ic_cdk::api::time();

            // Generate sequence ID and increment counter
            let sequence_id = SEQUENCE_COUNTER.with(|counter| {
                let current = *counter.borrow();
                let next_id = current + 1;
                *counter.borrow_mut() = next_id;
                next_id
            });

            // Create call context for audit purposes
            let call_context = CallContext {
                caller_principal: Some(caller.to_text()),
                execution_round: 0, // Placeholder - IC doesn't expose this directly
                canister_version: 1, // Placeholder - will be enhanced in subtask 2.4
                cycles_consumed: 0, // Placeholder - will be enhanced in subtask 2.4
            };

            // Create history entry
            let entry = RandomNumberEntry {
                number: random_number,
                timestamp,
                sequence_id,
                call_context,
            };

            // Store in history (with error handling that doesn't affect random number generation)
            let _store_result: Result<(), ()> = RANDOM_HISTORY.with(|history| {
                history.borrow_mut().push(entry);
                // Call cleanup function to maintain entry limit
                clear_old_entries();
                Ok(())
            });

            // Return the random number (backward compatibility maintained)
            Ok(random_number)
        }
        Err(e) => Err(format!("Failed to generate random number: {:?}", e)),
    }
}

#[ic_cdk::query]
fn get_random_history() -> Vec<RandomNumberEntry> {
    RANDOM_HISTORY.with(|history| {
        let mut entries = history.borrow().clone();
        // Return in reverse chronological order (most recent first)
        entries.reverse();
        entries
    })
}

#[ic_cdk::query]
fn verify_sequence_integrity() -> SequenceIntegrityStatus {
    RANDOM_HISTORY.with(|history| {
        let entries = history.borrow();
        let total_entries = entries.len() as u64;

        if total_entries == 0 {
            return SequenceIntegrityStatus {
                is_valid: true,
                total_entries: 0,
                expected_sequence_range: (0, 0),
                detected_gaps: Vec::new(),
                error_message: None,
            };
        }

        // Get all sequence IDs and sort them
        let mut sequence_ids: Vec<u64> = entries.iter().map(|entry| entry.sequence_id).collect();
        sequence_ids.sort();

        let min_seq = sequence_ids[0];
        let max_seq = sequence_ids[sequence_ids.len() - 1];
        let expected_range = (min_seq, max_seq);

        // Check for gaps in sequence
        let mut detected_gaps = Vec::new();
        for i in min_seq..=max_seq {
            if !sequence_ids.contains(&i) {
                detected_gaps.push(i);
            }
        }

        let is_valid = detected_gaps.is_empty();
        let error_message = if !is_valid {
            Some(format!("Found {} gaps in sequence", detected_gaps.len()))
        } else {
            None
        };

        SequenceIntegrityStatus {
            is_valid,
            total_entries,
            expected_sequence_range: expected_range,
            detected_gaps,
            error_message,
        }
    })
}

#[ic_cdk::query]
fn get_history_count() -> u64 {
    RANDOM_HISTORY.with(|history| history.borrow().len() as u64)
}

// Helper function to maintain maximum 1000 entries using circular buffer behavior
fn clear_old_entries() {
    RANDOM_HISTORY.with(|history| {
        let mut entries = history.borrow_mut();
        const MAX_ENTRIES: usize = 1000;

        if entries.len() > MAX_ENTRIES {
            // Remove oldest entries (from the beginning) to maintain the limit
            let excess = entries.len() - MAX_ENTRIES;
            entries.drain(0..excess);

            // Log cleanup action for debugging (using ic_cdk::println! for canister logs)
            ic_cdk::println!(
                "Cleaned up {} old entries, now storing {} entries",
                excess,
                entries.len()
            );
        }
    });
}

export_candid!();
