import { createTemplateRules } from './template-rules.factory.js';

describe('TemplateRules', () => {
  const validProps = {
    minExperienceLevel: 'beginner' as const,
    maxExperienceLevel: 'advanced' as const,
    requiredDaysPerWeek: 3,
    restrictions: {
      minSessionMinutes: 30,
      maxSessionMinutes: 90
    },
  };

  it('should create valid rules', () => {
    const result = createTemplateRules(validProps);
    expect(result.isSuccess).toBe(true);
  });

  it('should fail if minExperienceLevel is invalid', () => {
    const result = createTemplateRules({
      // @ts-expect-error Testing invalid input
      minExperienceLevel: 'expert',
      maxExperienceLevel: 'advanced' as const,
    });
    expect(result.isFailure).toBe(true);
  });

  it('should fail if experience levels are in wrong order', () => {
    const result = createTemplateRules({
      minExperienceLevel: 'advanced' as const,
      maxExperienceLevel: 'beginner' as const, // Higher min, lower max
    });
    expect(result.isFailure).toBe(true);
  });

  it('should fail if required days per week is invalid', () => {
    const result = createTemplateRules({
      minExperienceLevel: 'beginner' as const,
      maxExperienceLevel: 'advanced' as const,
      requiredDaysPerWeek: 8, // Too many days in a week
    });
    expect(result.isFailure).toBe(true);
  });
});