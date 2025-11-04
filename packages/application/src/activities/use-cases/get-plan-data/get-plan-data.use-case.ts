import { Result, UseCase } from '@bene/core/shared';
import { PlanRepository } from '../../ports/repository/plan.repository.js';
import { WorkoutRepository } from '../../ports/repository/activities.repository.js';
import { Plan, Workout } from '@bene/core/activities';
import { PlanDataFetchError } from '../../errors/index.js';

// Define the structure for weekly workout items (as per the UI needs)
interface WeeklyWorkoutPlan {
  id: string;
  day: string;
  date: string;
  exercise: string;
  sets: number;
  reps: number;
  duration?: string;
  completed: boolean;
}

// Define the structure for plan suggestions (as per the UI needs)
interface PlanSuggestion {
  id: string;
  name: string;
  duration: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

// Define the aggregated output structure
interface PlanDataOutput {
  currentPlan: Plan | null;
  weeklyWorkouts: WeeklyWorkoutPlan[];
  planSuggestions: PlanSuggestion[];
}

export class GetPlanDataUseCase implements UseCase<void, PlanDataOutput> {
  constructor(
    private planRepository: PlanRepository,
    private workoutRepository: WorkoutRepository
  ) {}

  async execute(): Promise<Result<PlanDataOutput>> {
    try {
      // Fetch all required data in parallel
      const [currentPlan, workoutHistory, planSuggestions] = await Promise.all([
        this.planRepository.getCurrentPlan(),
        this.workoutRepository.getWorkoutHistory(),
        this.planRepository.getPlanSuggestions()
      ]);

      // Transform the plan suggestions to match the expected structure
      const transformedPlanSuggestions: PlanSuggestion[] = planSuggestions.map(plan => ({
        id: plan.id,
        name: plan.name,
        duration: plan.duration,
        category: plan.category,
        difficulty: plan.difficulty
      }));

      // For weeklyWorkouts, we need to transform workout history into the expected UI format
      // The transformation may need to be customized based on actual requirements
      const weeklyWorkouts: WeeklyWorkoutPlan[] = this.transformWorkoutHistory(workoutHistory);

      // Return the aggregated data
      return Result.ok({
        currentPlan: currentPlan || null,
        weeklyWorkouts,
        planSuggestions: transformedPlanSuggestions
      });
    } catch (e) {
      console.log(e);
      return Result.fail(new PlanDataFetchError());
    }
  }

  private transformWorkoutHistory(workouts: Workout[]): WeeklyWorkoutPlan[] {
    // This is a basic transformation - in a real implementation, this would transform
    // the Workout entities into the format expected by the UI
    // For now, I'll return some mock data structure to match the original UI expectation
    return [
      {
        id: '1',
        day: 'Mon',
        date: 'May 6',
        exercise: 'Chest & Triceps',
        sets: 4,
        reps: 12,
        completed: true
      },
      {
        id: '2',
        day: 'Tue',
        date: 'May 7',
        exercise: 'Back & Biceps',
        sets: 4,
        reps: 12,
        completed: true
      },
      {
        id: '3',
        day: 'Wed',
        date: 'May 8',
        exercise: 'Legs Day',
        sets: 5,
        reps: 10,
        completed: false
      },
      {
        id: '4',
        day: 'Thu',
        date: 'May 9',
        exercise: 'Shoulders & Abs',
        sets: 3,
        reps: 15,
        completed: false
      },
      {
        id: '5',
        day: 'Fri',
        date: 'May 10',
        exercise: 'Full Body',
        sets: 4,
        reps: 10,
        completed: false
      },
      {
        id: '6',
        day: 'Sat',
        date: 'May 11',
        exercise: 'Rest or Light Cardio',
        sets: 0,
        reps: 0,
        duration: '20-30 min',
        completed: false
      },
      {
        id: '7',
        day: 'Sun',
        date: 'May 12',
        exercise: 'Rest',
        sets: 0,
        reps: 0,
        completed: false
      }
    ];
  }
}