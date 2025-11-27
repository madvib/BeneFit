import { VALID_DAYS } from '../../constants.js';

export interface PlanPosition {
  readonly week: number;
  readonly day: number; // 0-6 (Sunday-Saturday)
}