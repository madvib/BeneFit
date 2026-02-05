import { CreateView } from '@bene/shared';
import { ExperienceProfile } from './experience-profile.types.js';

export type ExperienceProfileView = CreateView<ExperienceProfile>;

export function toExperienceProfileView(profile: ExperienceProfile): ExperienceProfileView {
  return {
    ...profile,
    lastAssessmentDate: profile.lastAssessmentDate.toISOString(),
  };
}
