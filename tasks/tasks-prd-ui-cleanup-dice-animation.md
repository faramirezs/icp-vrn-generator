## Relevant Files

- `src/frontend/src/App.tsx` - Main application component that needs title/subtitle updates and component removal (MODIFIED).
- `src/frontend/src/views/GreetingView.tsx` - Template component to be removed completely (TO BE DELETED).
- `src/frontend/src/views/CounterView.tsx` - Template component to be removed completely (TO BE DELETED).
- `src/frontend/src/views/LlmPromptView.tsx` - Template component to be removed from frontend (TO BE DELETED).
- `src/frontend/src/views/index.ts` - Export file that needs cleanup after view removal (MODIFIED).
- `src/frontend/src/components/DiceAnimation.tsx` - New 3D dice component with pixel art styling (TO BE CREATED).
- `src/frontend/src/components/index.ts` - Component export file to include new DiceAnimation component (MODIFIED).
- `src/frontend/assets/React-icon.webp` - Current React logo to be replaced/removed (TO BE DELETED).
- `src/frontend/tests/views/GreetingView.test.tsx` - Test file to be removed (TO BE DELETED).
- `src/frontend/tests/views/CounterView.test.tsx` - Test file to be removed (TO BE DELETED).
- `src/frontend/tests/views/LlmPromptView.test.tsx` - Test file to be removed (TO BE DELETED).
- `src/frontend/tests/components/DiceAnimation.test.tsx` - Unit tests for new DiceAnimation component (TO BE CREATED).
- `src/frontend/tests/App.test.tsx` - Main app tests that need updates for new structure (MODIFIED).

### Notes

- The RandomGeneratorView and its history functionality should remain completely unchanged as it's the core feature
- LLM backend canister code should remain but be marked as inactive
- Focus on maintaining existing Tailwind CSS patterns and component structure
- All tests should pass after component removal and dice animation addition
- Use `npm test` to run all tests after implementation

## Tasks

- [ ] 1.0 Remove Unused Template Components and Update Imports

  - [x] 1.1 Delete `src/frontend/src/views/GreetingView.tsx` file completely
  - [x] 1.2 Delete `src/frontend/src/views/CounterView.tsx` file completely
  - [x] 1.3 Delete `src/frontend/src/views/LlmPromptView.tsx` file completely
  - [x] 1.4 Update `src/frontend/src/views/index.ts` to remove exports for deleted components
  - [x] 1.5 Remove imports for GreetingView, CounterView, and LlmPromptView from `src/frontend/src/App.tsx`
  - [x] 1.6 Remove JSX usage of GreetingView, CounterView, and LlmPromptView components from App.tsx render method
  - [x] 1.7 Verify application builds successfully with `npm run build` after component removal

- [ ] 2.0 Update Application Branding and Content

  - [x] 2.1 Replace main title "Vibe Coding Template" with "ICP Auditable Random Number Service" in App.tsx
  - [x] 2.2 Update subtitle from "React + Rust + Internet Computer" to "Cryptographically Secure Random Numbers with Full Audit Trail"
  - [x] 2.3 Remove or update any remaining "Vibe Coding Template" references in comments or documentation
  - [x] 2.4 Update page title in `src/frontend/index.html` if it contains template references
  - [x] 2.5 Verify new branding displays correctly in the browser

- [ ] 3.0 Create 3D Dice Animation Component

  - [x] 3.1 Create new file `src/frontend/src/components/DiceAnimation.tsx` with basic React component structure
  - [x] 3.2 Implement 3D dice faces using CSS transforms and positioned div elements for pixel art style
  - [x] 3.3 Create CSS keyframe animation for continuous slow rotation (4-second duration)
  - [x] 3.4 Add CSS hover state that speeds up rotation to 2-second duration with smooth transition
  - [x] 3.5 Style dice with white/light colors for dark theme compatibility and pixel art aesthetic
  - [x] 3.6 Set appropriate dimensions (approximately 96px height) to match current React logo size
  - [x] 3.7 Implement `prefers-reduced-motion` media query to disable animation for accessibility
  - [x] 3.8 Test dice animation performance and ensure smooth 60fps rotation

- [ ] 4.0 Integrate Dice Animation and Update Layout

  - [ ] 4.1 Import DiceAnimation component in `src/frontend/src/App.tsx`
  - [ ] 4.2 Replace React logo img element with DiceAnimation component in the same location
  - [ ] 4.3 Remove React logo import and related href link wrapper
  - [ ] 4.4 Update `src/frontend/src/components/index.ts` to export DiceAnimation component
  - [ ] 4.5 Remove old logo-spin animation styles from App.tsx since they're no longer needed
  - [ ] 4.6 Ensure dice animation maintains proper responsive behavior across screen sizes
  - [ ] 4.7 Test layout spacing and alignment to ensure no visual regression in overall design
  - [ ] 4.8 Verify hover effects work correctly and animation performance is smooth

- [ ] 5.0 Clean Up Assets and Update Tests
  - [ ] 5.1 Delete `src/frontend/assets/React-icon.webp` file as it's no longer needed
  - [ ] 5.2 Delete `src/frontend/tests/views/GreetingView.test.tsx` test file
  - [ ] 5.3 Delete `src/frontend/tests/views/CounterView.test.tsx` test file
  - [ ] 5.4 Delete `src/frontend/tests/views/LlmPromptView.test.tsx` test file
  - [ ] 5.5 Create `src/frontend/tests/components/DiceAnimation.test.tsx` with comprehensive component tests
  - [ ] 5.6 Update `src/frontend/tests/App.test.tsx` to test new title/subtitle content and DiceAnimation presence
  - [ ] 5.7 Remove any test assertions related to deleted components from App.test.tsx
  - [ ] 5.8 Run full test suite with `npm test` to ensure all tests pass
  - [ ] 5.9 Update any integration tests that might reference the removed components
  - [ ] 5.10 Verify build process works correctly with `npm run build` and test deployment
