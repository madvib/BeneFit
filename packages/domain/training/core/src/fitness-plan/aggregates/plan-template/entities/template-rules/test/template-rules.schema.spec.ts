import { describe, it, expect } from 'vitest';
import { TemplateRulesSchema, toTemplateRulesSchema } from '../template-rules.presentation.js';
import { createTemplateRules } from '../template-rules.factory.js';

describe('TemplateRules Presentation', () => {
  it('should map valid template rules to presentation DTO', () => {
    const rules = createTemplateRules({
      minExperienceLevel: 'beginner',
      maxExperienceLevel: 'advanced',
      requiredEquipment: ['Dumbbells'],
      requiredDaysPerWeek: 3,
    }).value;

    const presentation = toTemplateRulesSchema(rules);
    const result = TemplateRulesSchema.safeParse(presentation);

    expect(result.success).toBe(true);
    expect(presentation.minExperienceLevel).toBe('beginner');
    expect(presentation.requiredEquipment).toContain('Dumbbells');
  });

  it('should handle optional fields', () => {
    const rules = createTemplateRules({
      minExperienceLevel: 'intermediate',
      maxExperienceLevel: 'advanced',
    }).value;

    const presentation = toTemplateRulesSchema(rules);

    expect(presentation.requiredEquipment).toBeUndefined();
    expect(presentation.requiredDaysPerWeek).toBeUndefined();
  });
});
