// Define custom error types for goals in the application layer
export class GoalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GoalError";
  }
}

// Define specific error types for goals
export class GoalsFetchError extends GoalError {
  constructor() {
    super("Failed to fetch goals");
    this.name = "GoalsFetchError";
  }
}

export class CurrentGoalFetchError extends GoalError {
  constructor() {
    super("Failed to fetch current goal");
    this.name = "CurrentGoalFetchError";
  }
}

export class GoalNotFoundError extends GoalError {
  constructor(goalId: string) {
    super(`Goal with ID ${goalId} not found`);
    this.name = "GoalNotFoundError";
  }
}

export class GoalUpdateError extends GoalError {
  constructor() {
    super("Failed to update goal");
    this.name = "GoalUpdateError";
  }
}

export class GoalCreationError extends GoalError {
  constructor() {
    super("Failed to create goal");
    this.name = "GoalCreationError";
  }
}