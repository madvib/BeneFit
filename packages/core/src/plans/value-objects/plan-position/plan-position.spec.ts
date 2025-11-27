import { createPlanPosition, advanceDay, daysUntil, isBefore, isAfter, goToNextMonday } from "./plan-position.js";

describe('PlanPosition', () => {
  it('should advance correctly across week boundary', () => {
    const saturdayResult = createPlanPosition({ week: 1, day: 6 });
    if (saturdayResult.isSuccess) {
      const saturday = saturdayResult.value;
      const sunday = advanceDay(saturday);
      
      expect(sunday.week).toBe(2);
      expect(sunday.day).toBe(0);
    }
  });
  
  it('should calculate days between positions correctly', () => {
    const startResult = createPlanPosition({ week: 1, day: 0 });
    const endResult = createPlanPosition({ week: 2, day: 3 });
    
    if (startResult.isSuccess && endResult.isSuccess) {
      const start = startResult.value;
      const end = endResult.value;
      
      expect(daysUntil(start, end)).toBe(10); // 7 days + 3 days
    }
  });
  
  it('should compare positions correctly', () => {
    const earlierResult = createPlanPosition({ week: 1, day: 3 });
    const laterResult = createPlanPosition({ week: 2, day: 1 });
    
    if (earlierResult.isSuccess && laterResult.isSuccess) {
      const earlier = earlierResult.value;
      const later = laterResult.value;
      
      expect(isBefore(earlier, later)).toBe(true);
      expect(isAfter(later, earlier)).toBe(true);
    }
  });
  
  it('should navigate to next monday correctly', () => {
    const thursdayResult = createPlanPosition({ week: 1, day: 4 });
    
    if (thursdayResult.isSuccess) {
      const thursday = thursdayResult.value;
      const monday = goToNextMonday(thursday);
      
      expect(monday.day).toBe(1); // Monday
      expect(monday.week).toBe(2); // Next week
    }
  });
});