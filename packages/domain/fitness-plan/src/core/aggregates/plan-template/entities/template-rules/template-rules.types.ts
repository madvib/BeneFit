export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type LocationType = 'gym' | 'home' | 'outdoor';

export interface CustomizableParameter {
  name: string;
  type: 'number' | 'boolean' | 'string' | 'select';
  label: string;
  description: string;
  defaultValue: any;
  options?: any[]; // For select type
  validation?: {
    min?: number;
    max?: number;
    required?: boolean;
  };
}

export interface TemplateRestrictions {
  noInjuries?: string[]; // Can't use if these injuries present
  requiresEquipment?: string[];
  requiresLocation?: LocationType[];
  minSessionMinutes?: number;
  maxSessionMinutes?: number;
}

interface TemplateRulesData {
  requiredEquipment?: string[];
  minExperienceLevel: ExperienceLevel;
  maxExperienceLevel: ExperienceLevel;
  requiredDaysPerWeek?: number;
  restrictions?: TemplateRestrictions;
  customizableParameters?: CustomizableParameter[];
}

export type TemplateRules = Readonly<TemplateRulesData>;
