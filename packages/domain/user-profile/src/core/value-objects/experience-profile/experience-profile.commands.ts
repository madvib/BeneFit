import { Guard } from '@bene/domain-shared';
import { ExperienceLevel, ExperienceProfile, TrainingHistory, CurrentCapabilities } from './experience-profile.types.js';

// Update functions
export function updateExperienceLevel(profile: ExperienceProfile, level: ExperienceLevel): ExperienceProfile {
  return {
    ...profile,
    level,
    lastAssessmentDate: new Date(),
  };
}

export function updateExperienceHistory(profile: ExperienceProfile, history: Partial<TrainingHistory>): ExperienceProfile {
  return {
    ...profile,
    history: {
      ...profile.history,
      ...history,
    },
    lastAssessmentDate: new Date(),
  };
}

export function updateCapabilities(profile: ExperienceProfile, capabilities: CurrentCapabilities): ExperienceProfile {
  return {
    ...profile,
    capabilities,
    lastAssessmentDate: new Date(),
  };
}

export function addPreviousProgram(profile: ExperienceProfile, program: string): ExperienceProfile {
  const guardResult = Guard.againstEmptyString(program, 'program');
  if (guardResult && guardResult.isFailure) return profile; // If validation fails, return unchanged

  return {
    ...profile,
    history: {
      ...profile.history,
      previousPrograms: [...profile.history.previousPrograms, program],
    },
    lastAssessmentDate: new Date(),
  };
}

export function addSport(profile: ExperienceProfile, sport: string): ExperienceProfile {
  const guardResult = Guard.againstEmptyString(sport, 'sport');
  if (guardResult && guardResult.isFailure) return profile; // If validation fails, return unchanged

  return {
    ...profile,
    history: {
      ...profile.history,
      sports: [...profile.history.sports, sport],
    },
    lastAssessmentDate: new Date(),
  };
}

export function addCertification(profile: ExperienceProfile, certification: string): ExperienceProfile {
  const guardResult = Guard.againstEmptyString(certification, 'certification');
  if (guardResult && guardResult.isFailure) return profile; // If validation fails, return unchanged

  return {
    ...profile,
    history: {
      ...profile.history,
      certifications: [...profile.history.certifications, certification],
    },
    lastAssessmentDate: new Date(),
  };
}

// Query functions
export function hasExperienceIn(profile: ExperienceProfile, programType: string): boolean {
  return profile.history.previousPrograms.some(p => p.toLowerCase().includes(programType.toLowerCase()));
}

export function canPerform(profile: ExperienceProfile, activity: keyof CurrentCapabilities): boolean {
  return profile.capabilities[activity] === true;
}

export function getYearsOfExperience(profile: ExperienceProfile): number {
  return profile.history.yearsTraining || 0;
}

export function getExperienceLevel(profile: ExperienceProfile): ExperienceLevel {
  return profile.level;
}

export function getCapabilities(profile: ExperienceProfile): CurrentCapabilities {
  return profile.capabilities;
}

export function getCertifications(profile: ExperienceProfile): string[] {
  return profile.history.certifications;
}

export function getSportsBackground(profile: ExperienceProfile): string[] {
  return profile.history.sports;
}

export function getPreviousPrograms(profile: ExperienceProfile): string[] {
  return profile.history.previousPrograms;
}

// Evolution helper functions
export function shouldReassess(profile: ExperienceProfile, monthsSince: number = 6): boolean {
  const timeSinceAssessment = Date.now() - profile.lastAssessmentDate.getTime();
  const daysSinceAssessment = timeSinceAssessment / (1000 * 60 * 60 * 24);
  const monthsSinceAssessment = daysSinceAssessment / 30;

  return monthsSinceAssessment >= monthsSince;
}

export function equals(profile: ExperienceProfile, other: ExperienceProfile): boolean {
  if (!other) return false;

  return (
    profile.level === other.level &&
    profile.history.yearsTraining === other.history.yearsTraining &&
    JSON.stringify(profile.history.previousPrograms) === JSON.stringify(other.history.previousPrograms) &&
    JSON.stringify(profile.history.sports) === JSON.stringify(other.history.sports) &&
    JSON.stringify(profile.history.certifications) === JSON.stringify(other.history.certifications) &&
    profile.capabilities.canDoFullPushup === other.capabilities.canDoFullPushup &&
    profile.capabilities.canDoFullPullup === other.capabilities.canDoFullPullup &&
    profile.capabilities.canRunMile === other.capabilities.canRunMile &&
    profile.capabilities.canSquatBelowParallel === other.capabilities.canSquatBelowParallel
  );
}