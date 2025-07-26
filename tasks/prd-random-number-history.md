# Product Requirements Document: Random Number History

## Introduction/Overview

The Random Number History feature enhances the existing random number generator by adding persistent storage and display of all generated random numbers with timestamps. This feature transforms the application from a simple one-time generator into a comprehensive random number tracking system, allowing users to view the complete history of all numbers generated across all sessions and users.

**Problem**: Currently, generated random numbers disappear once a new number is generated, providing no way to track or reference previously generated values.

**Goal**: Implement persistent storage of random numbers with timestamps in the canister and display them in a user-friendly interface, creating a complete audit trail of all random number generation activity.

## Goals

1. **Persistent Storage**: Store all generated random numbers permanently in canister memory with accurate timestamps
2. **Global Accessibility**: Make the history available to all users, creating a shared global record
3. **Simple Display**: Provide a clean, intuitive interface to view the complete history of generated numbers
4. **Automatic Management**: Implement automatic cleanup when storage approaches canister limits
5. **Performance**: Ensure history viewing doesn't impact random number generation performance

## User Stories

### Primary User Stories

- **As a user**, I want to see all previously generated random numbers so that I can reference them later
- **As a user**, I want to know when each number was generated so that I can understand the timing
- **As a researcher**, I want to access the complete global history so that I can analyze patterns across all users
- **As a developer**, I want the system to automatically manage storage so that the canister doesn't run out of memory

### Secondary User Stories

- **As a user**, I want the history to load quickly so that I don't have to wait to see past numbers
- **As a user**, I want the most recent numbers to appear first so that I can easily find the latest generations

## Functional Requirements

1. **Backend Storage Requirements**
   1.1. The system must store each generated random number with an associated timestamp
   1.2. The system must use IC timestamp (`ic_cdk::api::time()`) for accurate, consensus-based timing
   1.3. The system must store data in canister-stable memory using thread_local storage
   1.4. The system must provide a query function to retrieve the complete history
   1.5. The system must implement automatic cleanup when storage approaches reasonable limits (e.g., 1000 entries)

2. **Frontend Display Requirements**
   2.1. The system must display random numbers in a simple list format
   2.2. The system must show timestamps in absolute format (YYYY-MM-DD HH:MM:SS)
   2.3. The system must display the most recent numbers first (reverse chronological order)
   2.4. The system must handle loading states while fetching history data
   2.5. The system must display appropriate messages when no history exists

3. **Integration Requirements**
   3.1. The random number generation function must automatically store each generated number
   3.2. The history view must integrate seamlessly with the existing RandomGeneratorView
   3.3. The system must update the Candid interface to include new history functions
   3.4. The system must maintain backward compatibility with existing functionality

4. **Data Structure Requirements**
   4.1. Each history entry must contain: random number (u64), timestamp (u64), sequence_id (u64), and call_context (CallContext)
   4.2. The sequence_id must be auto-incrementing and globally unique for ordering verification
   4.3. The call_context must capture caller principal, execution metadata, and resource consumption
   4.4. The storage must be implemented as a Vec<RandomNumberEntry> in thread_local storage
   4.5. The system must provide proper serialization for stable storage if needed

5. **Auditing Requirements**
   5.1. The system must generate sequential, gap-free sequence numbers for audit trail integrity
   5.2. The system must capture and store the caller's principal ID for each request
   5.3. The system must record execution metadata including canister version and cycles consumed
   5.4. The system must provide query functions to verify sequence integrity and detect tampering
   5.5. The system must maintain immutable audit logs that cannot be modified after creation

## Non-Goals (Out of Scope)

- **User-specific history**: This version will not implement per-user filtering or private histories
- **Advanced analytics**: No statistical analysis, pattern detection, or advanced insights
- **Export functionality**: No CSV export, data download, or external API integration
- **Search and filtering**: No ability to search or filter the history by criteria
- **Number deletion**: No ability to delete individual entries or clear history manually
- **Real-time updates**: No live updates when other users generate numbers
- **Pagination**: Simple display of all entries without complex pagination controls

## Design Considerations

### Backend Data Structure

```rust
#[derive(Clone, Debug)]
struct RandomNumberEntry {
    pub number: u64,
    pub timestamp: u64,
    pub sequence_id: u64,        // Auto-incrementing sequence for ordering verification
    pub call_context: CallContext, // Request metadata for auditing
}

#[derive(Clone, Debug)]
struct CallContext {
    pub caller_principal: Option<String>, // Principal ID of the caller
    pub execution_round: u64,            // IC execution round (if available)
    pub canister_version: u64,           // Canister version at time of call
    pub cycles_consumed: u64,            // Cycles used for the operation
}
```

### Frontend Components

- Extend existing `RandomGeneratorView` with a collapsible history section
- Use consistent Tailwind CSS styling matching existing components
- Implement loading states and error handling following current patterns
- Display format: "Seq #123: 123456789 | Generated: 2025-01-15 14:30:22 | Caller: abc123..."
- Include expandable details showing full call context and audit metadata
- Add sequence gap detection and validation indicators in the UI

### Storage Management

- Implement circular buffer behavior when approaching 1000 entries
- Remove oldest entries first when storage limit is reached
- Log cleanup actions for debugging purposes

## Technical Considerations

### Backend Implementation

- Use `ic_cdk::api::time()` for consensus-based timestamps
- Implement thread_local storage similar to existing COUNTER pattern
- Add new functions: `get_random_history()`, `verify_sequence_integrity()`, and `clear_old_entries()`
- Modify `generate_random_number()` to automatically store results with full audit context
- Capture caller principal using `ic_cdk::api::caller()`
- Record canister version and cycles consumed for each operation
- Implement sequence number generation with gap detection

### Frontend Integration

- Add new service functions `getRandomHistory()` and `verifySequenceIntegrity()` in `backendService.ts`
- Extend `RandomGeneratorView` component with expandable history section showing audit details
- Implement proper TypeScript types for `RandomNumberEntry` and `CallContext`
- Add loading and error states for history fetching and integrity verification
- Display sequence gaps or validation errors prominently in the UI
- Include audit trail summary showing total entries, sequence range, and integrity status

### On-Chain Auditing Capabilities

- **Consensus Timestamps**: All timestamps are IC consensus-based, making them immutable and verifiable
- **Sequence Integrity**: Auto-incrementing sequence numbers enable detection of missing or tampered entries
- **Caller Traceability**: Each entry records the principal ID of the requesting entity
- **Execution Context**: Captures canister version, cycles consumed, and execution metadata
- **Canister State Auditing**: All random number storage is part of the canister's certified state
- **Call Traceability**: Each `raw_rand()` call is recorded in IC's execution history
- **Cryptographic Verification**: Numbers can be cryptographically verified as legitimate IC-generated randomness
- **Audit Trail Integrity**: Sequence gaps and inconsistencies can be programmatically detected

### Performance Considerations

- Query function for history retrieval to avoid update call costs
- Limit initial display to prevent UI performance issues
- Consider lazy loading if history grows very large

### Auditing Limitations

- **No Direct Beacon Access**: Cannot access underlying random beacon rounds directly
- **No Block Publishing**: IC doesn't expose specific consensus rounds per random generation
- **Indirect Traceability**: Must rely on canister state and timestamps rather than blockchain block numbers

## Success Metrics

1. **Functional Success**
   - 100% of generated random numbers are successfully stored with timestamps and complete audit context
   - Sequence numbers are gap-free and properly incremented for all entries
   - History display loads within 2 seconds for up to 1000 entries including audit metadata
   - Zero data loss during automatic cleanup operations
   - Audit trail integrity verification passes for all stored entries

2. **User Experience Success**
   - Users can view complete generation history with audit details immediately after generating numbers
   - History display is readable and properly formatted on all screen sizes
   - Sequence integrity status is clearly visible and understandable
   - No impact on random number generation performance
   - Audit information is accessible but not overwhelming in the default view

3. **Technical Success**
   - Candid interface properly updated with new audit functions
   - All existing tests continue to pass
   - New audit functionality covered by comprehensive unit and integration tests
   - Sequence integrity verification functions work correctly
   - Call context capture works for all types of callers (authenticated and anonymous)

## Open Questions

1. **Storage Optimization**: Should we implement compression for timestamp and audit metadata storage to save memory?
2. **Display Limits**: Should we implement virtual scrolling for very large histories, or is simple rendering sufficient?
3. **Timezone Handling**: Should timestamps be displayed in user's local timezone or UTC?
4. **Error Recovery**: How should the system handle corrupted history data or sequence integrity failures?
5. **Future Scalability**: Should we design the data structure to easily support per-user histories in future versions?
6. **Audit Retention**: How long should detailed audit metadata be retained vs. summary information only?
7. **Sequence Recovery**: If sequence gaps are detected, should the system attempt automatic recovery or require manual intervention?
8. **Call Context Limits**: Should there be size limits on stored call context to prevent memory bloat?

## Implementation Priority

**Phase 1 (MVP)**: Backend storage and basic frontend display
**Phase 2 (Enhancement)**: Automatic cleanup and improved UI
**Phase 3 (Polish)**: Error handling and performance optimization

---

_This PRD should be reviewed with the development team before implementation begins._
