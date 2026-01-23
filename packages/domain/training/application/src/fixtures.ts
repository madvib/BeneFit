// Fixture aggregator for @bene/training-application
// This file provides a separate entry point for test fixtures (response builders)

// Use case response builders - Fitness Plans
export * from './use-cases/get-current-plan/test/get-current-plan.fixture.js';
export * from './use-cases/generate-plan-from-goals/test/generate-plan-from-goals.fixture.js';
export * from './use-cases/activate-plan/test/activate-plan.fixture.js';
export * from './use-cases/pause-plan/test/pause-plan.fixture.js';
export * from './use-cases/adjust-plan-based-on-feedback/test/adjust-plan-based-on-feedback.fixture.js';

// Use case response builders - Workouts
export * from './use-cases/get-todays-workout/test/get-todays-workout.fixture.js';
export * from './use-cases/get-upcoming-workouts/test/get-upcoming-workouts.fixture.js';
export * from './use-cases/get-workout-history/test/get-workout-history.fixture.js';
export * from './use-cases/skip-workout/test/skip-workout.fixture.js';
export * from './use-cases/start-workout/test/start-workout.fixture.js';
export * from './use-cases/complete-workout/test/complete-workout.fixture.js';
export * from './use-cases/join-multiplayer-workout/test/join-multiplayer-workout.fixture.js';
export * from './use-cases/add-workout-reaction/test/add-workout-reaction.fixture.js';

// Use case response builders - Profile
export * from './use-cases/get-profile/test/get-profile.fixture.js';
export * from './use-cases/get-user-stats/test/get-user-stats.fixture.js';

// Core entity fixtures (re-exported for direct access)
export * from '@bene/training-core/fixtures';