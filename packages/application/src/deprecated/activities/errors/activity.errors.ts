// Define custom error types for activities in the application layer
export class ActivityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ActivityError';
  }
}

// Define specific error types for activities
export class WorkoutHistoryFetchError extends ActivityError {
  constructor() {
    super('Failed to fetch workout history. Please try again later.');
    this.name = 'WorkoutHistoryFetchError';
  }
}

export class ActivityFeedFetchError extends ActivityError {
  constructor() {
    super('Failed to fetch activity feed. Please try again later.');
    this.name = 'ActivityFeedFetchError';
  }
}

export class PlanDataFetchError extends ActivityError {
  constructor() {
    super('Failed to fetch plan data. Please try again later.');
    this.name = 'PlanDataFetchError';
  }
}

export class ServicesFetchError extends ActivityError {
  constructor() {
    super('Failed to fetch services. Please try again later.');
    this.name = 'ServicesFetchError';
  }
}

export class ChartDataFetchError extends ActivityError {
  constructor() {
    super('Failed to fetch chart data. Please try again later.');
    this.name = 'ChartDataFetchError';
  }
}

export class WorkoutNotFoundError extends ActivityError {
  constructor() {
    super('Workout not found. Please check the workout ID and try again.');
    this.name = 'WorkoutNotFoundError';
  }
}
