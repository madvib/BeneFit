import { Guard, Result, ExperienceLevel, EXPERIENCE_LEVELS } from '@bene/shared';
import {
  TemplateRestrictions,
  CustomizableParameter,
  TemplateRules,
  TemplateRulesView,
} from './template-rules.types.js';

export function createTemplateRules(props: {
  minExperienceLevel: ExperienceLevel;
  maxExperienceLevel: ExperienceLevel;
  requiredEquipment?: string[];
  requiredDaysPerWeek?: number;
  restrictions?: TemplateRestrictions;
  customizableParameters?: CustomizableParameter[];
}): Result<TemplateRules> {
  const guardResult = Guard.combine([
    Guard.againstNullOrUndefined(props.minExperienceLevel, 'minExperienceLevel'),
    Guard.againstNullOrUndefined(props.maxExperienceLevel, 'maxExperienceLevel'),
  ]);
  if (guardResult.isFailure) return Result.fail(guardResult.error);

  const minIdx = EXPERIENCE_LEVELS.indexOf(props.minExperienceLevel);
  const maxIdx = EXPERIENCE_LEVELS.indexOf(props.maxExperienceLevel);

  // Validate that the experience levels are valid
  const minLevelResult = Guard.isTrue(
    minIdx !== -1,
    `minExperienceLevel must be one of: ${ EXPERIENCE_LEVELS.join(', ') }`,
  );
  if (minLevelResult.isFailure) return Result.fail(minLevelResult.error);

  const maxLevelResult = Guard.isTrue(
    maxIdx !== -1,
    `maxExperienceLevel must be one of: ${ EXPERIENCE_LEVELS.join(', ') }`,
  );
  if (maxLevelResult.isFailure) return Result.fail(maxLevelResult.error);

  const rangeResult = Guard.isTrue(
    minIdx <= maxIdx,
    'minExperienceLevel must be <= maxExperienceLevel',
  );
  if (rangeResult.isFailure) return Result.fail(rangeResult.error);

  if (props.requiredDaysPerWeek !== undefined) {
    const daysResult = Guard.inRange(
      props.requiredDaysPerWeek,
      1,
      7,
      'requiredDaysPerWeek',
    );
    if (daysResult.isFailure) return Result.fail(daysResult.error);
  }

  // Validate restrictions if present
  if (props.restrictions) {
    if (props.restrictions.minSessionMinutes !== undefined) {
      const minResult = Guard.againstNegativeOrZero(
        props.restrictions.minSessionMinutes,
        'restrictions.minSessionMinutes',
      );
      if (minResult.isFailure) return Result.fail(minResult.error);
    }
    if (props.restrictions.maxSessionMinutes !== undefined) {
      const maxResult = Guard.againstNegativeOrZero(
        props.restrictions.maxSessionMinutes,
        'restrictions.maxSessionMinutes',
      );
      if (maxResult.isFailure) return Result.fail(maxResult.error);
    }
    if (props.restrictions.minSessionMinutes && props.restrictions.maxSessionMinutes) {
      const rangeRes = Guard.isTrue(
        props.restrictions.minSessionMinutes <= props.restrictions.maxSessionMinutes,
        'minSessionMinutes must be <= maxSessionMinutes',
      );
      if (rangeRes.isFailure) return Result.fail(rangeRes.error);
    }
  }

  // Validate customizable parameters
  if (props.customizableParameters) {
    for (const param of props.customizableParameters) {
      const paramGuard = Guard.againstNullOrUndefinedBulk([
        { argument: param.name, argumentName: 'parameter.name' },
        { argument: param.type, argumentName: 'parameter.type' },
        { argument: param.label, argumentName: 'parameter.label' },
        { argument: param.description, argumentName: 'parameter.description' },
      ]);
      if (paramGuard.isFailure) return Result.fail(paramGuard.error);

      if (param.type === 'select') {
        const optionsGuard = Guard.againstNullOrUndefined(
          param.options,
          'parameter.options for select type',
        );
        if (optionsGuard.isFailure) return Result.fail(optionsGuard.error);

        const lenGuard = Guard.isTrue(
          param.options!.length > 0,
          'select parameter must have options',
        );
        if (lenGuard.isFailure) return Result.fail(lenGuard.error);
      }
    }
  }

  return Result.ok({
    requiredEquipment: props.requiredEquipment,
    minExperienceLevel: props.minExperienceLevel,
    maxExperienceLevel: props.maxExperienceLevel,
    requiredDaysPerWeek: props.requiredDaysPerWeek,
    restrictions: props.restrictions,
  });
}

export function toTemplateRulesView(rules: TemplateRules): TemplateRulesView {
  return {
    requiredEquipment: rules.requiredEquipment ? [...rules.requiredEquipment] : undefined,
    minExperienceLevel: rules.minExperienceLevel,
    maxExperienceLevel: rules.maxExperienceLevel,
    requiredDaysPerWeek: rules.requiredDaysPerWeek,
    restrictions: rules.restrictions ? {
      ...rules.restrictions,
      noInjuries: rules.restrictions.noInjuries ? [...rules.restrictions.noInjuries] : undefined,
      requiresEquipment: rules.restrictions.requiresEquipment ? [...rules.restrictions.requiresEquipment] : undefined,
      requiresLocation: rules.restrictions.requiresLocation ? [...rules.restrictions.requiresLocation] : undefined,
    } : undefined,
    customizableParameters: rules.customizableParameters ? rules.customizableParameters.map(p => ({
      ...p,
      options: p.options ? [...p.options] : undefined,
    })) : undefined,
  };
}
