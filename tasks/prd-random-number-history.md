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
   4.1. Each history entry must contain: random number (u64), timestamp (u64), and optional ID
   4.2. The storage must be implemented as a Vec<RandomNumberEntry> in thread_local storage
   4.3. The system must provide proper serialization for stable storage if needed

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
    pub id: u64, // Auto-incrementing ID for ordering
}
```

### Frontend Components

- Extend existing `RandomGeneratorView` with a collapsible history section
- Use consistent Tailwind CSS styling matching existing components
- Implement loading states and error handling following current patterns
- Display format: "Number: 123456789 | Generated: 2025-01-15 14:30:22"

### Storage Management

- Implement circular buffer behavior when approaching 1000 entries
- Remove oldest entries first when storage limit is reached
- Log cleanup actions for debugging purposes

## Technical Considerations

### Backend Implementation

- Use `ic_cdk::api::time()` for consensus-based timestamps
- Implement thread_local storage similar to existing COUNTER pattern
- Add new functions: `get_random_history()` and `clear_old_entries()`
- Modify `generate_random_number()` to automatically store results

### Frontend Integration

- Add new service function `getRandomHistory()` in `backendService.ts`
- Extend `RandomGeneratorView` component with history display section
- Implement proper TypeScript types for `RandomNumberEntry`
- Add loading and error states for history fetching

### Performance Considerations

- Query function for history retrieval to avoid update call costs
- Limit initial display to prevent UI performance issues
- Consider lazy loading if history grows very large

## Success Metrics

1. **Functional Success**

   - 100% of generated random numbers are successfully stored with timestamps
   - History display loads within 2 seconds for up to 1000 entries
   - Zero data loss during automatic cleanup operations

2. **User Experience Success**

   - Users can view complete generation history immediately after generating numbers
   - History display is readable and properly formatted on all screen sizes
   - No impact on random number generation performance

3. **Technical Success**
   - Candid interface properly updated with new functions
   - All existing tests continue to pass
   - New functionality covered by comprehensive unit and integration tests

## Open Questions

1. **Storage Optimization**: Should we implement compression for timestamp storage to save memory?
2. **Display Limits**: Should we implement virtual scrolling for very large histories, or is simple rendering sufficient?
3. **Timezone Handling**: Should timestamps be displayed in user's local timezone or UTC?
4. **Error Recovery**: How should the system handle corrupted history data or storage failures?
5. **Future Scalability**: Should we design the data structure to easily support per-user histories in future versions?

## Implementation Priority

**Phase 1 (MVP)**: Backend storage and basic frontend display
**Phase 2 (Enhancement)**: Automatic cleanup and improved UI
**Phase 3 (Polish)**: Error handling and performance optimization

---

_This PRD should be reviewed with the development team before implementation begins._
