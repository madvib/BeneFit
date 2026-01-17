import { faker } from '@faker-js/faker';
import {
  TemplateStructure,
  TemplateDuration,
  TemplateFrequency,
  WeekTemplate,
  WorkoutDayTemplate,
  WorkoutActivityTemplate
} from '../template-structure.types.js';

export function createTemplateStructureFixture(overrides?: Partial<TemplateStructure>): TemplateStructure {
  const duration: TemplateDuration = {
    type: 'fixed',
    weeks: faker.number.int({ min: 4, max: 12 })
  };

  const frequency: TemplateFrequency = {
    type: 'fixed',
    workoutsPerWeek: faker.number.int({ min: 3, max: 5 })
  };

  const activityTemplate: WorkoutActivityTemplate = {
    activityType: 'main',
    template: 'Do {{reps}} reps of {{exercise}}',
    variables: { reps: 10, exercise: 'Pushups' }
  };

  const workoutTemplate: WorkoutDayTemplate = {
    type: 'strength',
    durationMinutes: 45,
    activities: [activityTemplate]
  };

  const weekTemplate: WeekTemplate = {
    weekNumber: 1,
    workouts: [workoutTemplate, workoutTemplate, workoutTemplate]
  };

  return {
    duration,
    frequency,
    weeks: [weekTemplate],
    progressionFormula: '{{intensity}} * 1.05',
    ...overrides,
  };
}
