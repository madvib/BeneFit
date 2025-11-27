import { ValueObject, Result, Guard } from '@shared';
import { ActivityStructure } from '../activity-structure/activity-structure.js';
import { ActivityValidationError } from '../../../plans/errors/workout-plan-errors.js';

export type ActivityType = 'warmup' | 'main' | 'cooldown' | 'interval' | 'circuit';

export interface WorkoutActivityProps {
  readonly name: string;
  readonly type: ActivityType;
  readonly order: number;
  readonly structure?: ActivityStructure;
  readonly instructions?: readonly string[];
  readonly distance?: number; // meters
  readonly duration?: number; // minutes
  readonly pace?: string; // e.g., "easy", "moderate", "5:30/km"
  readonly videoUrl?: string;
  readonly equipment?: readonly string[];
  readonly alternativeExercises?: readonly string[];
}

export class WorkoutActivity extends ValueObject<WorkoutActivityProps> {
  private constructor(props: WorkoutActivityProps) {
    super(props);
  }

  public static create(props: WorkoutActivityProps): Result<WorkoutActivity> {
    const guardResult = Guard.combine([
      Guard.againstEmptyString(props.name, 'activity name'),
      Guard.againstNullOrUndefined(props.type, 'activity type'),
      Guard.againstNullOrUndefined(props.order, 'order'),
    ]);

    if (guardResult.isFailure) {
      return Result.fail(guardResult.error);
    }

    // Validate order
    if (props.order < 0) {
      return Result.fail(new ActivityValidationError('Order must be >= 0', { order: props.order }));
    }

    // Validate distance
    if (props.distance !== undefined && props.distance <= 0) {
      return Result.fail(new ActivityValidationError('Distance must be positive', { distance: props.distance }));
    }

    // Validate duration
    if (props.duration !== undefined && props.duration <= 0) {
      return Result.fail(new ActivityValidationError('Duration must be positive', { duration: props.duration }));
    }

    // Validate video URL format (basic check)
    if (props.videoUrl !== undefined) {
      try {
        new URL(props.videoUrl);
      } catch {
        return Result.fail(new ActivityValidationError('Invalid video URL', { videoUrl: props.videoUrl }));
      }
    }

    // Validate equipment array
    if (props.equipment) {
      for (const item of props.equipment) {
        const equipGuard = Guard.againstEmptyString(item, 'equipment item');
        if (equipGuard.isFailure) {
          return Result.fail(equipGuard.error);
        }
      }
    }

    return Result.ok(new WorkoutActivity(props));
  }

  // Factory methods for common activities
  public static createWarmup(
    name: string,
    duration: number,
    order: number = 0
  ): Result<WorkoutActivity> {
    return WorkoutActivity.create({
      name,
      type: 'warmup',
      order,
      duration,
      instructions: ['Start slowly', 'Gradually increase intensity'],
    });
  }

  public static createCooldown(
    name: string,
    duration: number,
    order: number
  ): Result<WorkoutActivity> {
    return WorkoutActivity.create({
      name,
      type: 'cooldown',
      order,
      duration,
      instructions: ['Gradually decrease intensity', 'Focus on breathing'],
    });
  }

  public static createDistanceRun(
    distance: number,
    pace: string,
    order: number
  ): Result<WorkoutActivity> {
    return WorkoutActivity.create({
      name: `${ distance }m run`,
      type: 'main',
      order,
      distance,
      pace,
      equipment: [],
    });
  }

  public static createIntervalSession(
    name: string,
    structure: ActivityStructure,
    order: number
  ): Result<WorkoutActivity> {
    if (!structure.isIntervalBased()) {
      return Result.fail(new ActivityValidationError('Structure must be interval-based', { structureType: 'not-interval' }));
    }

    return WorkoutActivity.create({
      name,
      type: 'interval',
      order,
      structure,
      duration: structure.getTotalDuration() / 60, // Convert seconds to minutes
    });
  }

  public static createCircuit(
    name: string,
    structure: ActivityStructure,
    order: number,
    equipment?: string[]
  ): Result<WorkoutActivity> {
    if (!structure.isExerciseBased()) {
      return Result.fail(new ActivityValidationError('Structure must be exercise-based', { structureType: 'not-exercise' }));
    }

    return WorkoutActivity.create({
      name,
      type: 'circuit',
      order,
      structure,
      equipment,
      duration: structure.getTotalDuration() / 60,
    });
  }

  // Getters
  get name(): string {
    return this.props.name;
  }

  get type(): ActivityType {
    return this.props.type;
  }

  get order(): number {
    return this.props.order;
  }

  get structure(): ActivityStructure | undefined {
    return this.props.structure;
  }

  get instructions(): readonly string[] | undefined {
    return this.props.instructions;
  }

  get distance(): number | undefined {
    return this.props.distance;
  }

  get duration(): number | undefined {
    return this.props.duration;
  }

  get pace(): string | undefined {
    return this.props.pace;
  }

  get videoUrl(): string | undefined {
    return this.props.videoUrl;
  }

  get equipment(): readonly string[] | undefined {
    return this.props.equipment;
  }

  get alternativeExercises(): readonly string[] | undefined {
    return this.props.alternativeExercises;
  }

  // Type checks
  public isWarmup(): boolean {
    return this.props.type === 'warmup';
  }

  public isCooldown(): boolean {
    return this.props.type === 'cooldown';
  }

  public isMainActivity(): boolean {
    return this.props.type === 'main';
  }

  public isIntervalBased(): boolean {
    return this.props.type === 'interval';
  }

  public isCircuit(): boolean {
    return this.props.type === 'circuit';
  }

  // Equipment queries
  public requiresEquipment(): boolean {
    return this.props.equipment !== undefined && this.props.equipment.length > 0;
  }

  public hasEquipment(equipment: string): boolean {
    if (!this.props.equipment) return false;
    return this.props.equipment.some(e => e.toLowerCase() === equipment.toLowerCase());
  }

  public getEquipmentList(): string[] {
    return this.props.equipment ? [...this.props.equipment] : [];
  }

  // Content queries
  public hasStructure(): boolean {
    return this.props.structure !== undefined && !this.props.structure.isEmpty();
  }

  public hasInstructions(): boolean {
    return this.props.instructions !== undefined && this.props.instructions.length > 0;
  }

  public hasVideo(): boolean {
    return this.props.videoUrl !== undefined;
  }

  public hasAlternatives(): boolean {
    return this.props.alternativeExercises !== undefined &&
      this.props.alternativeExercises.length > 0;
  }

  // Duration calculations
  public getEstimatedDuration(): number {
    // Priority: explicit duration > structure duration > default
    if (this.props.duration !== undefined) {
      return this.props.duration;
    }

    if (this.props.structure) {
      return this.props.structure.getTotalDuration() / 60; // Convert to minutes
    }

    // Defaults based on type
    switch (this.props.type) {
      case 'warmup':
        return 10;
      case 'cooldown':
        return 10;
      case 'main':
        return 30;
      case 'interval':
      case 'circuit':
        return 20;
      default:
        return 15;
    }
  }

  public getEstimatedCalories(userWeight: number = 70): number {
    // Very rough estimates (MET values * time * weight)
    const duration = this.getEstimatedDuration();

    if (this.isWarmup() || this.isCooldown()) {
      return Math.round(duration * 3 * userWeight / 60); // 3 METs
    }

    if (this.isIntervalBased()) {
      return Math.round(duration * 10 * userWeight / 60); // 10 METs (high intensity)
    }

    if (this.isCircuit()) {
      return Math.round(duration * 8 * userWeight / 60); // 8 METs
    }

    return Math.round(duration * 6 * userWeight / 60); // 6 METs (moderate)
  }

  // Transformations (immutable)
  public withDifferentDuration(duration: number): Result<WorkoutActivity> {
    if (duration <= 0) {
      return Result.fail(new ActivityValidationError('Duration must be positive', { duration }));
    }

    return Result.ok(new WorkoutActivity({
      ...this.props,
      duration,
    }));
  }

  public withDifferentDistance(distance: number): Result<WorkoutActivity> {
    if (distance <= 0) {
      return Result.fail(new ActivityValidationError('Distance must be positive', { distance }));
    }

    return Result.ok(new WorkoutActivity({
      ...this.props,
      distance,
    }));
  }

  public withDifferentPace(pace: string): Result<WorkoutActivity> {
    const guardResult = Guard.againstEmptyString(pace, 'pace');
    if (guardResult.isFailure) {
      return Result.fail(guardResult.error);
    }

    return Result.ok(new WorkoutActivity({
      ...this.props,
      pace,
    }));
  }

  public withStructure(structure: ActivityStructure): Result<WorkoutActivity> {
    return Result.ok(new WorkoutActivity({
      ...this.props,
      structure,
    }));
  }

  public withAdjustedStructure(
    adjustment: (structure: ActivityStructure) => ActivityStructure
  ): Result<WorkoutActivity> {
    if (!this.props.structure) {
      return Result.fail(new ActivityValidationError('No structure to adjust'));
    }

    const adjustedStructure = adjustment(this.props.structure);

    return Result.ok(new WorkoutActivity({
      ...this.props,
      structure: adjustedStructure,
      duration: adjustedStructure.getTotalDuration() / 60,
    }));
  }

  public withAdditionalInstruction(instruction: string): Result<WorkoutActivity> {
    const guardResult = Guard.againstEmptyString(instruction, 'instruction');
    if (guardResult.isFailure) {
      return Result.fail(guardResult.error);
    }

    const instructions = this.props.instructions
      ? [...this.props.instructions, instruction]
      : [instruction];

    return Result.ok(new WorkoutActivity({
      ...this.props,
      instructions,
    }));
  }

  public withVideo(videoUrl: string): Result<WorkoutActivity> {
    try {
      new URL(videoUrl);
    } catch {
      return Result.fail(new ActivityValidationError('Invalid video URL', { videoUrl }));
    }

    return Result.ok(new WorkoutActivity({
      ...this.props,
      videoUrl,
    }));
  }

  public withAlternative(exercise: string): Result<WorkoutActivity> {
    const guardResult = Guard.againstEmptyString(exercise, 'alternative exercise');
    if (guardResult.isFailure) {
      return Result.fail(guardResult.error);
    }

    const alternatives = this.props.alternativeExercises
      ? [...this.props.alternativeExercises, exercise]
      : [exercise];

    return Result.ok(new WorkoutActivity({
      ...this.props,
      alternativeExercises: alternatives,
    }));
  }

  public withNewOrder(order: number): Result<WorkoutActivity> {
    if (order < 0) {
      return Result.fail(new ActivityValidationError('Order must be >= 0', { order }));
    }

    return Result.ok(new WorkoutActivity({
      ...this.props,
      order,
    }));
  }

  // AI Coach adjustments
  public adjustForFatigue(fatigueLevel: number): Result<this> {
    // fatigueLevel: 0 (fresh) to 1 (exhausted)
    if (fatigueLevel < 0 || fatigueLevel > 1) {
      return Result.fail(new ActivityValidationError('Fatigue level must be 0-1', { fatigueLevel }));
    }

    // Don't adjust warmup/cooldown
    if (this.isWarmup() || this.isCooldown()) {
      return Result.ok(this);
    }

    let adjusted: this = this;

    // Adjust duration
    if (this.props.duration) {
      const durationAdjustment = 1 - (fatigueLevel * 0.3); // Up to 30% reduction
      const newDuration = Math.max(5, Math.round(this.props.duration * durationAdjustment));
      adjusted = new WorkoutActivity({
        ...adjusted.props,
        duration: newDuration,
      }) as this;
    }

    // Adjust structure intensity
    if (this.props.structure) {
      const intensityAdjustment = 1 - (fatigueLevel * 0.25); // Up to 25% easier
      const adjustedStructure = this.props.structure.withAdjustedIntensity(intensityAdjustment);
      adjusted = new WorkoutActivity({
        ...adjusted.props,
        structure: adjustedStructure,
      }) as this;
    }

    // Adjust distance
    if (this.props.distance) {
      const distanceAdjustment = 1 - (fatigueLevel * 0.2); // Up to 20% shorter
      const newDistance = Math.max(100, Math.round(this.props.distance * distanceAdjustment));
      adjusted = new WorkoutActivity({
        ...adjusted.props,
        distance: newDistance,
      }) as this;
    }

    return Result.ok(adjusted);
  }

  public makeEasier(factor: number = 0.8): Result<this> {
    if (factor <= 0 || factor >= 1) {
      return Result.fail(new ActivityValidationError('Factor must be between 0 and 1', { factor }));
    }

    // Don't adjust warmup/cooldown
    if (this.isWarmup() || this.isCooldown()) {
      return Result.ok(this);
    }

    let adjusted: this = this;

    // Reduce duration
    if (this.props.duration) {
      adjusted = new WorkoutActivity({
        ...adjusted.props,
        duration: Math.max(5, Math.round(this.props.duration * factor)),
      }) as this;
    }

    // Reduce intensity via structure
    if (this.props.structure) {
      adjusted = new WorkoutActivity({
        ...adjusted.props,
        structure: this.props.structure.withAdjustedIntensity(factor),
      }) as this;
    }

    // Reduce distance
    if (this.props.distance) {
      adjusted = new WorkoutActivity({
        ...adjusted.props,
        distance: Math.max(100, Math.round(this.props.distance * factor)),
      }) as this;
    }

    return Result.ok(adjusted);
  }

  public makeHarder(factor: number = 1.2): Result<this> {
    if (factor <= 1) {
      return Result.fail(new ActivityValidationError('Factor must be > 1', { factor }));
    }

    // Don't adjust warmup/cooldown
    if (this.isWarmup() || this.isCooldown()) {
      return Result.ok(this);
    }

    let adjusted: this = this;

    // Increase duration
    if (this.props.duration) {
      adjusted = new WorkoutActivity({
        ...adjusted.props,
        duration: Math.round(this.props.duration * factor),
      }) as this;
    }

    // Increase intensity via structure
    if (this.props.structure) {
      adjusted = new WorkoutActivity({
        ...adjusted.props,
        structure: this.props.structure.withAdjustedIntensity(factor),
      }) as this;
    }

    // Increase distance
    if (this.props.distance) {
      adjusted = new WorkoutActivity({
        ...adjusted.props,
        distance: Math.round(this.props.distance * factor),
      }) as this;
    }

    return Result.ok(adjusted);
  }

  // Display helpers
  public getShortDescription(): string {
    if (this.props.distance) {
      return `${ this.props.name } - ${ this.props.distance }m`;
    }

    const duration = this.getEstimatedDuration();
    return `${ this.props.name } - ${ duration }min`;
  }

  public getDetailedDescription(): string {
    let desc = this.props.name;

    if (this.props.duration || this.props.distance) {
      const details: string[] = [];

      if (this.props.duration) {
        details.push(`${ this.props.duration }min`);
      }

      if (this.props.distance) {
        details.push(`${ this.props.distance }m`);
      }

      if (this.props.pace) {
        details.push(`@ ${ this.props.pace }`);
      }

      desc += ` (${ details.join(', ') })`;
    }

    if (this.requiresEquipment()) {
      desc += `\nEquipment: ${ this.props.equipment!.join(', ') }`;
    }

    return desc;
  }

  public getInstructionsList(): string[] {
    const instructions: string[] = [];

    if (this.props.instructions) {
      instructions.push(...this.props.instructions);
    }

    if (this.props.structure) {
      instructions.push(this.props.structure.getDescription());
    }

    return instructions;
  }

  // Equality
  public override equals(other: WorkoutActivity): boolean {
    if (!other) return false;

    return (
      this.props.name === other.props.name &&
      this.props.type === other.props.type &&
      this.props.order === other.props.order &&
      this.props.duration === other.props.duration &&
      this.props.distance === other.props.distance &&
      this.props.pace === other.props.pace &&
      JSON.stringify(this.props.equipment) === JSON.stringify(other.props.equipment) &&
      this.props.structure?.equals(other.props.structure ?? ActivityStructure.createEmpty()) !== false
    );
  }
}