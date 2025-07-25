## Relevant Files

- `src/backend/src/lib.rs` - Main canister implementation file where the new `generate_random_number()` function will be added.
- `src/backend/backend.did` - Candid interface file that needs to be updated to include the new random number function.
- `src/frontend/src/services/backendService.ts` - Backend service layer where the new `generateRandomNumber()` API call will be added.
- `src/frontend/src/views/RandomGeneratorView.tsx` - New view component for the random number generator interface (to be created).
- `src/frontend/src/views/index.ts` - Barrel export file that needs to include the new RandomGeneratorView component.
- `src/frontend/src/App.tsx` - Main app component where the new RandomGeneratorView will be integrated.
- `src/declarations/backend/` - Auto-generated TypeScript declarations (will be updated after Candid generation).
- `tests/src/backend.test.ts` - Backend integration tests where random number generation tests will be added.
- `src/frontend/tests/views/RandomGeneratorView.test.tsx` - Unit tests for the new RandomGeneratorView component with comprehensive test coverage.
- `src/frontend/tests/services/backendService.test.ts` - Service layer tests for the new generateRandomNumber function (to be created).

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `RandomGeneratorView.tsx` and `RandomGeneratorView.test.tsx` in the same directory).
- Use `npm test` to run all tests. The project uses Vitest for frontend tests and PocketIC for backend integration tests.
- Run `npm run generate-candid` after backend changes to update TypeScript declarations.

## Tasks

- [x] 1.0 Implement Backend Random Number Generation

  - [x] 1.1 Add the `ic_cdk::api::management_canister::raw_rand` import to `src/backend/src/lib.rs`
  - [x] 1.2 Create the `generate_random_number()` async function with `#[ic_cdk::update]` macro
  - [x] 1.3 Implement error handling for `raw_rand()` API call failures
  - [x] 1.4 Convert the raw bytes from `raw_rand()` to a `u64` decimal number using `u64::from_be_bytes()`
  - [x] 1.5 Return `Result<u64, String>` to handle both success and error cases
  - [x] 1.6 Update `src/backend/backend.did` Candid interface to include the new function signature
  - [x] 1.7 Run `npm run generate-candid` to update TypeScript declarations

- [x] 2.0 Create Frontend Random Generator View

  - [x] 2.1 Create `src/frontend/src/views/RandomGeneratorView.tsx` following existing view patterns
  - [x] 2.2 Import required components: `Button`, `Card`, and existing error/loading components
  - [x] 2.3 Add component props interface matching `CounterView` pattern (`onError`, `setLoading`)
  - [x] 2.4 Implement `useState` for storing the generated random number
  - [x] 2.5 Create async `handleGenerateNumber()` function that calls the backend service
  - [x] 2.6 Add proper error handling that calls `onError` prop for failures
  - [x] 2.7 Implement loading state management using `setLoading` prop
  - [x] 2.8 Design responsive UI with single prominent "Generate Random Number" button
  - [x] 2.9 Add clear display area for the generated number with proper formatting
  - [x] 2.10 Apply consistent Tailwind CSS styling matching existing components

- [x] 3.0 Integrate Random Generator into Application

  - [x] 3.1 Add `generateRandomNumber()` function to `src/frontend/src/services/backendService.ts`
  - [x] 3.2 Implement proper TypeScript typing for the new service function
  - [x] 3.3 Add error handling and async/await patterns consistent with existing service functions
  - [x] 3.4 Export `RandomGeneratorView` from `src/frontend/src/views/index.ts` barrel file
  - [x] 3.5 Import `RandomGeneratorView` in `src/frontend/src/App.tsx`
  - [x] 3.6 Add the new view to the main App component layout following existing pattern
  - [x] 3.7 Ensure the view receives proper `onError` and `setLoading` props from App state

- [ ] 4.0 Add Comprehensive Testing

  - [x] 4.1 Create `src/frontend/src/views/RandomGeneratorView.test.tsx` with component rendering tests
  - [x] 4.2 Add unit tests for button click behavior and loading states
  - [ ] 4.3 Test error handling scenarios with mock backend failures
  - [ ] 4.4 Create `src/frontend/src/services/backendService.test.ts` for service layer testing
  - [ ] 4.5 Add backend integration tests in `tests/src/backend.test.ts` for the new function
  - [ ] 4.6 Test the `generate_random_number()` function success and failure scenarios
  - [ ] 4.7 Verify proper `raw_rand()` integration using PocketIC test environment
  - [ ] 4.8 Run all tests with `npm test` to ensure no regressions

- [ ] 5.0 Update Documentation and Deployment
  - [ ] 5.1 Add code comments and JSDoc documentation to all new functions
  - [ ] 5.2 Update README.md to include the new random number generator feature
  - [ ] 5.3 Test the complete feature end-to-end in development environment
  - [ ] 5.4 Verify mobile responsiveness on minimum 320px width screens
  - [ ] 5.5 Deploy and test the feature in a clean environment to ensure it works for judges
