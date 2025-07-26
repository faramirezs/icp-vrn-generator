# Product Requirements Document: UI Cleanup and Dice Animation

## Introduction/Overview

This feature involves cleaning up the AiPricePulse frontend interface by removing template components and replacing the React logo with an interactive 3D dice animation that reflects the application's core purpose as a cryptographically secure random number generator. The goal is to create a focused, professional interface that clearly communicates the application's identity as an "ICP Auditable Random Number Service" while providing an engaging visual element that represents randomness.

## Goals

1. **Simplify Interface**: Remove unnecessary template components (greeting, counter, LLM prompt) to focus on the core random number generation functionality
2. **Improve Branding**: Update title and subtitle to clearly identify the application's purpose and technology stack
3. **Enhance User Engagement**: Replace static React logo with an interactive 3D dice animation that provides visual feedback and represents the random nature of the service
4. **Maintain Clean Architecture**: Keep removed backend functionality (LLM canister) available but inactive for potential future use

## User Stories

1. **As a user visiting the application**, I want to immediately understand that this is a random number service powered by Internet Computer, so that I know what the application does and can trust its technology foundation.

2. **As a user interacting with the interface**, I want to see a visually appealing dice animation that responds to my mouse movements, so that I feel engaged and the randomness aspect is visually reinforced.

3. **As a user focused on generating random numbers**, I want a clean interface without distracting elements, so that I can focus on the core functionality without confusion.

4. **As a developer maintaining the codebase**, I want unused components removed but backend services preserved, so that the code is clean while maintaining options for future features.

## Functional Requirements

### 1. Content Updates

1.1. Replace main title with "ICP Auditable Random Number Service"
1.2. Update subtitle to reflect the application's purpose and Internet Computer technology
1.3. Remove "Vibe Coding Template" branding completely

### 2. Component Removal

2.1. Remove GreetingView component and all associated files
2.2. Remove CounterView component and all associated files  
2.3. Remove LlmPromptView component from frontend interface
2.4. Update imports and exports in view index files
2.5. Clean up unused imports in App.tsx

### 3. Dice Animation Implementation

3.1. Create a 3D rendered dice component with pixel art styling
3.2. Implement continuous slow rolling animation (approximately 1 rotation every 3-4 seconds)
3.3. Add mouse hover interaction that speeds up the rolling animation
3.4. Position the dice animation in the same location as the current React logo
3.5. Ensure the dice shows different faces during rotation
3.6. Apply appropriate styling to match the existing dark theme

### 4. Layout Adjustments

4.1. Maintain the centered layout structure
4.2. Ensure proper spacing around the new dice animation
4.3. Preserve responsive design principles
4.4. Keep the existing hover effects styling pattern but applied to the dice

### 5. Backend Preservation

5.1. Keep LLM canister code in the backend but mark as inactive
5.2. Maintain backend API endpoints for potential future reactivation
5.3. Update deployment configuration to exclude LLM frontend components

## Non-Goals (Out of Scope)

- Removing the LLM canister from the backend entirely
- Changing the core random number generation functionality
- Modifying the history display feature that was recently implemented
- Adding sound effects to the dice animation
- Creating multiple dice or complex dice physics
- Implementing dice roll results that affect the random number generation
- Mobile-specific animation optimizations (will use CSS media queries for basic responsiveness)

## Design Considerations

### Visual Design

- **Dice Style**: 3D rendered with pixel art aesthetic to match modern retro gaming themes
- **Animation**: Smooth, continuous rotation with CSS transforms
- **Hover Effect**: Acceleration of rotation speed (from 3-4 seconds per rotation to 1-2 seconds)
- **Color Scheme**: Dark theme compatibility with white or light-colored dice faces
- **Size**: Similar dimensions to current React logo (approximately 96px height)

### Technical Implementation

- Use CSS 3D transforms for the dice animation
- Implement with React components and Tailwind CSS
- Ensure smooth animation performance across browsers
- Use `transform3d` for hardware acceleration
- Implement hover state with CSS transitions

## Technical Considerations

### Dependencies

- Continue using existing Tailwind CSS framework
- No additional animation libraries required (pure CSS implementation)
- Maintain current React component structure

### Performance

- Use CSS transforms instead of changing layout properties for better performance
- Implement `will-change` property for animation optimization
- Consider `motion-reduce` media query for accessibility

### File Structure

- Create new `DiceAnimation` component in `/src/frontend/src/components/`
- Remove files: `GreetingView.tsx`, `CounterView.tsx`, `LlmPromptView.tsx`
- Update `views/index.ts` exports
- Update `App.tsx` imports and JSX

## Success Metrics

1. **User Experience**: Reduced interface complexity measured by fewer UI elements and clearer purpose
2. **Performance**: Animation maintains 60fps on modern browsers
3. **Engagement**: Visual feedback responds appropriately to user interaction (hover state)
4. **Code Quality**: Removal of unused components reduces bundle size by approximately 15-20%
5. **Brand Clarity**: Users can immediately identify the application's purpose from the title and visual elements

## Acceptance Criteria

### Title and Branding

- [ ] Main title displays "ICP Auditable Random Number Service"
- [ ] Subtitle accurately describes the service and technology
- [ ] All "Vibe Coding Template" references are removed

### Component Removal

- [ ] Greeting section is completely removed from the interface
- [ ] Counter functionality is removed from the interface
- [ ] LLM prompt interface is removed from the frontend
- [ ] Application builds successfully with no broken imports
- [ ] LLM backend canister remains available but inactive

### Dice Animation

- [ ] 3D dice appears in place of React logo
- [ ] Dice rotates continuously at slow speed (3-4 seconds per rotation)
- [ ] Hover interaction speeds up rotation to 1-2 seconds per rotation
- [ ] Animation is smooth and doesn't cause performance issues
- [ ] Dice styling matches the dark theme aesthetic
- [ ] Animation respects `prefers-reduced-motion` accessibility setting

### Layout and Responsive Design

- [ ] Dice animation maintains proper positioning across screen sizes
- [ ] Overall layout remains centered and well-spaced
- [ ] Interface works correctly on desktop and mobile devices
- [ ] No visual regression in the random number generator section

## Open Questions

1. Should the dice faces show traditional dots (pips) or numbers 1-6?
2. Would you like the dice to briefly pause/highlight when the user generates a random number?
3. Should we add any subtle shadow or glow effects to enhance the 3D appearance?
4. Do you want to preserve any particular aspect ratio or size constraints for the dice?

## Implementation Priority

**Phase 1 (High Priority)**:

- Remove unused components (GreetingView, CounterView, LlmPromptView)
- Update title and subtitle
- Create basic dice component structure

**Phase 2 (Medium Priority)**:

- Implement 3D dice animation with CSS transforms
- Add continuous rotation functionality
- Apply pixel art styling

**Phase 3 (Low Priority)**:

- Implement hover speed-up interaction
- Fine-tune animation performance
- Add accessibility considerations
