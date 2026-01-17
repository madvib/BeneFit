import { describe, it, expect } from 'vitest';
import { createTemplateStructure } from '../../template-structure/template-structure.factory.js';
import { createTemplateRules } from '../../template-rules/template-rules.factory.js';
import { publishTemplate, createTemplateRevision } from '../plan-template.commands.js';
import { createPlanTemplate } from '../plan-template.factory.js';

describe('PlanTemplate', () => {
  const mockStructure = createTemplateStructure({
    duration: { type: 'fixed', weeks: 4 },
    frequency: { type: 'fixed', workoutsPerWeek: 3 },
    weeks: [{
      weekNumber: 1,
      workouts: [{
        type: 'strength',
        durationMinutes: 30,
        activities: [{ activityType: 'main', template: 'Run', variables: {} }]
      }]
    }]
  }).value;

  const mockRules = createTemplateRules({
    minExperienceLevel: 'beginner',
    maxExperienceLevel: 'advanced',
    restrictions: { minSessionMinutes: 30, maxSessionMinutes: 60 },
    customizableParameters: []
  }).value;

  const validProps = {
    name: 'Couch to 5K',
    description: 'Beginner running plan',
    author: { name: 'Coach Bene', userId: 'user1' },
    tags: ['running'],
    structure: mockStructure,
    rules: mockRules,
    isPublic: false
  };

  it('should create valid template', () => {
    const result = createPlanTemplate(validProps);
    expect(result.isSuccess).toBe(true);
    expect(result.value.version).toBe(1);
    expect(result.value.metadata.isPublic).toBe(false);
  });

  it('should fail if name is empty', () => {
    const result = createPlanTemplate({ ...validProps, name: '' });
    expect(result.isFailure).toBe(true);
  });

  it('should publish template', () => {
    const template = createPlanTemplate(validProps).value;
    const result = publishTemplate(template);

    expect(result.isSuccess).toBe(true);
    expect(result.value.metadata.isPublic).toBe(true);
  });

  it('should fail to publish already published template', () => {
    const template = createPlanTemplate(validProps).value;
    const published = publishTemplate(template).value;
    const result = publishTemplate(published);

    expect(result.isFailure).toBe(true);
  });

  it('should create revision', () => {
    const template = createPlanTemplate(validProps).value;
    const published = publishTemplate(template).value;

    const revision = createTemplateRevision(published, { name: 'Updated Plan' }).value;

    expect(revision.version).toBe(2);
    expect(revision.name).toBe('Updated Plan');
    expect(revision.metadata.isPublic).toBe(false);
  });
});
