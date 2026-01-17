export interface ServicePermissionsData {
  readWorkouts: boolean;
  readHeartRate: boolean;
  readSleep: boolean;
  readNutrition: boolean;
  readBodyMetrics: boolean; // Weight, body fat, etc.
  writeWorkouts: boolean; // Push our workouts to their service
}
export type ServicePermissions = Readonly<ServicePermissionsData>;

export function createServicePermissions(
  props: Partial<ServicePermissions>,
): ServicePermissions {
  return {
    readWorkouts: props.readWorkouts ?? false,
    readHeartRate: props.readHeartRate ?? false,
    readSleep: props.readSleep ?? false,
    readNutrition: props.readNutrition ?? false,
    readBodyMetrics: props.readBodyMetrics ?? false,
    writeWorkouts: props.writeWorkouts ?? false,
  };
}
