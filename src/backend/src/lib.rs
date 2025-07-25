use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::export_candid;
use std::cell::RefCell;

use ic_llm::{ChatMessage, Model};

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

            Ok(random_number)
        }
        Err(e) => Err(format!("Failed to generate random number: {:?}", e)),
    }
}

export_candid!();
