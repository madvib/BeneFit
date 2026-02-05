// Equipment organized by category
export const EQUIPMENT_CATEGORIES = {
  'Free Weights': ['dumbbells', 'barbell', 'kettlebells', 'weight_plates'],
  'Machines & Racks': ['squat_rack', 'bench_press', 'cable_machine', 'leg_press', 'smith_machine'],
  'Cardio Equipment': ['treadmill', 'stationary_bike', 'rowing_machine', 'elliptical', 'jump_rope'],
  'Bodyweight & Accessories': ['pull_up_bar', 'dip_station', 'resistance_bands', 'suspension_trainer', 'medicine_ball', 'foam_roller', 'yoga_mat'],
  'Minimal': ['bodyweight_only', 'other'],
} as const;

export const EQUIPMENT_OPTIONS = Object.values(EQUIPMENT_CATEGORIES).flat();
