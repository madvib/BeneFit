// // packages/infrastructure/src/durable-objects/user-agent.ts

// import type { FitnessPlan} from '@benefit/training-core';
// import type { UserProfile } from '@benefit/training-core';
// import type { CoachConversation } from '@benefit/coach-domain';
// import type { CompletedWorkout } from '@benefit/training-core';
// import { DurableFitnessPlanRepository } from 'src/repositories/durable-workout-plan.repository.js';
// import { DurableUserProfileRepository } from 'src/repositories/durable-user-profile.repository.js';
// import { DurableCompletedWorkoutRepository } from 'src/repositories/durable-completed-workout.repository.js';
// /**
//  * UserAgent Durable Object
//  *
//  * Stores per-user hot data:
//  * - Active WorkoutPlan
//  * - UserProfile (cached from D1)
//  * - CoachConversation
//  * - Recent CompletedWorkouts (last 30 days)
//  *
//  * Periodically snapshots to D1 for persistence
//  */
// export class UserAgent extends DurableObject {
//   // In-memory cache
//   private profile: UserProfile | null = null;
//   private activePlan: FitnessPlan| null = null;
//   private coaching: CoachConversation | null = null;
//   private recentWorkouts: CompletedWorkout[] = [];

//   // Metadata
//   private lastSnapshotAt: Date | null = null;
//   private isHydrated = false;

//   constructor(ctx: DurableObjectState, env: Env) {
//     super(ctx, env);

//     // Schedule alarm for periodic snapshots
//     ctx.blockConcurrencyWhile(async () => {
//       await this.hydrate();
//     });
//   }

//   async fetch(request: Request): Promise<Response> {
//     const url = new URL(request.url);
//     const method = request.method;

//     try {
//       // Ensure hydrated
//       if (!this.isHydrated) {
//         await this.hydrate();
//       }

//       // Route to handlers
//       switch (url.pathname) {
//         case '/profile':
//           return this.handleProfile(method, request);
//         case '/plan':
//           return this.handlePlan(method, request);
//         case '/plan/current':
//           return this.handleCurrentPlan(method);
//         case '/plan/complete-workout':
//           return this.handleCompleteWorkout(method, request);
//         case '/coaching':
//           return this.handleCoach(method, request);
//         case '/workouts/recent':
//           return this.handleRecentWorkouts(method, request);
//         case '/snapshot':
//           return this.handleSnapshot();
//         case '/stats':
//           return this.handleStats();
//         default:
//           return new Response('Not found', { status: 404 });
//       }
//     } catch (error) {
//       console.error('UserAgent error:', error);
//       return new Response(JSON.stringify({ error: String(error) }), {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }
//   }

//   // ============================================================================
//   // PROFILE HANDLERS
//   // ============================================================================

//   private async handleProfile(method: string, request: Request): Promise<Response> {
//     if (method === 'GET') {
//       if (!this.profile) {
//         return new Response(JSON.stringify({ error: 'Profile not found' }), {
//           status: 404,
//           headers: { 'Content-Type': 'application/json' },
//         });
//       }
//       return Response.json(this.profile);
//     }

//     if (method === 'PUT') {
//       const profile = (await request.json()) as UserProfile;
//       this.profile = profile;

//       await this.ctx.storage.put('profile', profile);

//       // Schedule snapshot
//       this.scheduleSnapshot();

//       return Response.json({ success: true });
//     }

//     return new Response('Method not allowed', { status: 405 });
//   }

//   // ============================================================================
//   // PLAN HANDLERS
//   // ============================================================================

//   private async handlePlan(method: string, request: Request): Promise<Response> {
//     if (method === 'GET') {
//       if (!this.activePlan) {
//         return new Response(JSON.stringify({ error: 'No active plan' }), {
//           status: 404,
//           headers: { 'Content-Type': 'application/json' },
//         });
//       }
//       return Response.json(this.activePlan);
//     }

//     if (method === 'PUT') {
//       const plan = (await request.json()) as WorkoutPlan;
//       this.activePlan = plan;

//       await this.ctx.storage.put('activePlan', plan);

//       this.scheduleSnapshot();

//       return Response.json({ success: true });
//     }

//     if (method === 'DELETE') {
//       this.activePlan = null;
//       await this.ctx.storage.delete('activePlan');

//       this.scheduleSnapshot();

//       return Response.json({ success: true });
//     }

//     return new Response('Method not allowed', { status: 405 });
//   }

//   private async handleCurrentPlan(method: string): Promise<Response> {
//     if (method !== 'GET') {
//       return new Response('Method not allowed', { status: 405 });
//     }

//     if (!this.activePlan) {
//       return Response.json({ hasPlan: false, plan: null });
//     }

//     // Return plan with today's workout
//     const todaysWorkout = this.getTodaysWorkout();

//     return Response.json({
//       hasPlan: true,
//       plan: {
//         id: this.activePlan.id,
//         name: this.activePlan.name,
//         status: this.activePlan.status,
//         currentWeek: this.activePlan.position.weekNumber,
//         currentDay: this.activePlan.position.dayNumber,
//         totalWeeks: this.activePlan.duration.weeks,
//       },
//       todaysWorkout: todaysWorkout
//         ? {
//             id: todaysWorkout.id,
//             type: todaysWorkout.type,
//             status: todaysWorkout.status,
//             estimatedDurationMinutes: todaysWorkout.estimatedDurationMinutes,
//             activities: todaysWorkout.activities,
//           }
//         : null,
//     });
//   }

//   private async handleCompleteWorkout(
//     method: string,
//     request: Request,
//   ): Promise<Response> {
//     if (method !== 'POST') {
//       return new Response('Method not allowed', { status: 405 });
//     }

//     if (!this.activePlan) {
//       return new Response(JSON.stringify({ error: 'No active plan' }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const { workoutId, completedWorkoutId } = (await request.json()) as {
//       workoutId: string;
//       completedWorkoutId: string;
//     };

//     // This would call domain method: completeWorkout(plan, workoutId, completedWorkoutId)
//     // For now, simplified:
//     // const updatedPlanResult = completeWorkout(this.activePlan, workoutId, completedWorkoutId);
//     // if (updatedPlanResult.isFailure) {
//     //   return new Response(updatedPlanResult.error, { status: 400 });
//     // }
//     // this.activePlan = updatedPlanResult.value;

//     await this.ctx.storage.put('activePlan', this.activePlan);
//     this.scheduleSnapshot();

//     return Response.json({ success: true });
//   }

//   // ============================================================================
//   // COACHING HANDLERS
//   // ============================================================================

//   private async handleCoach(method: string, request: Request): Promise<Response> {
//     if (method === 'GET') {
//       if (!this.coaching) {
//         return new Response(JSON.stringify({ error: 'No coaching conversation' }), {
//           status: 404,
//           headers: { 'Content-Type': 'application/json' },
//         });
//       }
//       return Response.json(this.coaching);
//     }

//     if (method === 'PUT') {
//       const coaching = (await request.json()) as CoachConversation;
//       this.coaching = coaching;

//       await this.ctx.storage.put('coaching', coaching);

//       this.scheduleSnapshot();

//       return Response.json({ success: true });
//     }

//     return new Response('Method not allowed', { status: 405 });
//   }

//   // ============================================================================
//   // WORKOUTS HANDLERS
//   // ============================================================================

//   private async handleRecentWorkouts(
//     method: string,
//     request: Request,
//   ): Promise<Response> {
//     if (method === 'GET') {
//       return Response.json({ workouts: this.recentWorkouts });
//     }

//     if (method === 'POST') {
//       const workout = (await request.json()) as CompletedWorkout;

//       // Add to recent workouts
//       this.recentWorkouts.unshift(workout);

//       // Keep only last 30 days
//       const thirtyDaysAgo = new Date();
//       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//       this.recentWorkouts = this.recentWorkouts.filter(
//         (w) => w.recordedAt >= thirtyDaysAgo,
//       );

//       await this.ctx.storage.put('recentWorkouts', this.recentWorkouts);

//       return Response.json({ success: true });
//     }

//     return new Response('Method not allowed', { status: 405 });
//   }

//   // ============================================================================
//   // UTILITY HANDLERS
//   // ============================================================================

//   private async handleSnapshot(): Promise<Response> {
//     await this.snapshotToD1();
//     return Response.json({
//       success: true,
//       snapshotAt: this.lastSnapshotAt,
//     });
//   }

//   private async handleStats(): Promise<Response> {
//     return Response.json({
//       hasProfile: this.profile !== null,
//       hasPlan: this.activePlan !== null,
//       hasCoach: this.coaching !== null,
//       recentWorkoutsCount: this.recentWorkouts.length,
//       lastSnapshotAt: this.lastSnapshotAt,
//       isHydrated: this.isHydrated,
//     });
//   }

//   // ============================================================================
//   // PERSISTENCE
//   // ============================================================================

//   private async hydrate(): Promise<void> {
//     if (this.isHydrated) return;

//     try {
//       // Load from DO storage
//       const stored = await this.ctx.storage.get<{
//         profile: UserProfile;
//         activePlan: WorkoutPlan;
//         coaching: CoachConversation;
//         recentWorkouts: CompletedWorkout[];
//         lastSnapshotAt: string;
//       }>(['profile', 'activePlan', 'coaching', 'recentWorkouts', 'lastSnapshotAt']);

//       this.profile = stored.get('profile') || null;
//       this.activePlan = stored.get('activePlan') || null;
//       this.coaching = stored.get('coaching') || null;
//       this.recentWorkouts = stored.get('recentWorkouts') || [];

//       const lastSnapshotStr = stored.get('lastSnapshotAt');
//       this.lastSnapshotAt = lastSnapshotStr
//         ? new Date(lastSnapshotStr as string)
//         : null;

//       this.isHydrated = true;
//     } catch (error) {
//       console.error('Failed to hydrate UserAgent:', error);
//       this.isHydrated = true; // Continue anyway
//     }
//   }

//   private scheduleSnapshot(): void {
//     // Schedule alarm for 5 minutes from now if not already scheduled
//     const fiveMinutes = 5 * 60 * 1000;
//     const now = Date.now();

//     if (!this.lastSnapshotAt || now - this.lastSnapshotAt.getTime() > fiveMinutes) {
//       this.ctx.storage.setAlarm(now + fiveMinutes);
//     }
//   }

//   async alarm(): Promise<void> {
//     await this.snapshotToD1();
//   }

//   private async snapshotToD1(): Promise<void> {
//     // In real implementation, this would:
//     // 1. Get D1 binding from env
//     // 2. Use Drizzle to update tables
//     // 3. Save profile, plan metadata, coaching snapshot

//     // For now, just mark as done
//     this.lastSnapshotAt = new Date();
//     await this.ctx.storage.put('lastSnapshotAt', this.lastSnapshotAt.toISOString());

//     // Schedule next alarm for 5 minutes
//     const fiveMinutes = 5 * 60 * 1000;
//     await this.ctx.storage.setAlarm(Date.now() + fiveMinutes);
//   }

//   // ============================================================================
//   // HELPERS
//   // ============================================================================

//   private getTodaysWorkout(): any | null {
//     if (!this.activePlan) return null;

//     // This would call domain query: getTodaysWorkout(plan)
//     // For now, simplified
//     return null;
//   }
// }

// // ============================================================================
// // TYPE DEFINITIONS FOR ENV
// // ============================================================================

// interface Env {
//   USER_AGENT: DurableObjectNamespace;
//   WORKOUT_SESSION_AGENT: DurableObjectNamespace;
//   DB: D1Database;
//   ANTHROPIC_API_KEY: string;
// }
