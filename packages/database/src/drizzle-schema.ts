// packages/database/src/schema/

import { sqliteTable, text, integer, real, index, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// USERS & PROFILES
// ============================================================================

// Auth managed by Better Auth, but we need the reference
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const userProfiles = sqliteTable('user_profiles', {
  userId: text('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  
  // Personal info
  displayName: text('display_name').notNull(),
  avatar: text('avatar'),
  bio: text('bio'),
  location: text('location'),
  timezone: text('timezone').notNull(),
  
  // Fitness profile (JSON serialized)
  experienceProfile: text('experience_profile', { mode: 'json' }).notNull(), // ExperienceProfile
  fitnessGoals: text('fitness_goals', { mode: 'json' }).notNull(), // FitnessGoals
  trainingConstraints: text('training_constraints', { mode: 'json' }).notNull(), // TrainingConstraints
  
  // Preferences (JSON serialized)
  preferences: text('preferences', { mode: 'json' }).notNull(), // UserPreferences
  
  // Stats
  totalWorkouts: integer('total_workouts').notNull().default(0),
  totalMinutes: integer('total_minutes').notNull().default(0),
  totalVolume: real('total_volume').notNull().default(0), // kg lifted
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  lastWorkoutDate: integer('last_workout_date', { mode: 'timestamp' }),
  
  // Metadata
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  lastActiveAt: integer('last_active_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  userIdIdx: index('user_profiles_user_id_idx').on(table.userId),
  lastActiveIdx: index('user_profiles_last_active_idx').on(table.lastActiveAt),
}));

export const achievements = sqliteTable('achievements', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievementType: text('achievement_type').notNull(), // "first_workout", "10_workouts", etc.
  name: text('name').notNull(),
  description: text('description').notNull(),
  iconUrl: text('icon_url'),
  earnedAt: integer('earned_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  userIdIdx: index('achievements_user_id_idx').on(table.userId),
  earnedAtIdx: index('achievements_earned_at_idx').on(table.earnedAt),
}));

// ============================================================================
// WORKOUT PLANS & TEMPLATES
// ============================================================================

export const planTemplates = sqliteTable('plan_templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  
  // Author
  authorUserId: text('author_user_id').references(() => users.id),
  authorName: text('author_name').notNull(),
  authorCredentials: text('author_credentials'),
  
  // Tags for discovery
  tags: text('tags', { mode: 'json' }).notNull(), // string[]
  
  // Template structure (JSON serialized)
  structure: text('structure', { mode: 'json' }).notNull(), // TemplateStructure
  rules: text('rules', { mode: 'json' }).notNull(), // TemplateRules
  
  // Metadata
  isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(false),
  isFeatured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
  isVerified: integer('is_verified', { mode: 'boolean' }).notNull().default(false),
  rating: real('rating'),
  usageCount: integer('usage_count').notNull().default(0),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
}, (table) => ({
  authorIdx: index('plan_templates_author_idx').on(table.authorUserId),
  publicIdx: index('plan_templates_public_idx').on(table.isPublic),
  featuredIdx: index('plan_templates_featured_idx').on(table.isFeatured),
  ratingIdx: index('plan_templates_rating_idx').on(table.rating),
}));

// Plan metadata only - full plan lives in UserAgent DO
export const workoutPlansMetadata = sqliteTable('workout_plans_metadata', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // Basic info
  name: text('name').notNull(),
  status: text('status').notNull(), // 'draft' | 'active' | 'paused' | 'completed' | 'abandoned'
  
  // Template reference
  templateId: text('template_id').references(() => planTemplates.id),
  
  // Dates
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  startedAt: integer('started_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  abandonedAt: integer('abandoned_at', { mode: 'timestamp' }),
  
  // Quick stats
  totalWeeks: integer('total_weeks').notNull(),
  currentWeek: integer('current_week').notNull().default(1),
  completedWorkouts: integer('completed_workouts').notNull().default(0),
  totalScheduledWorkouts: integer('total_scheduled_workouts').notNull(),
}, (table) => ({
  userIdIdx: index('workout_plans_metadata_user_id_idx').on(table.userId),
  statusIdx: index('workout_plans_metadata_status_idx').on(table.status),
  userStatusIdx: index('workout_plans_metadata_user_status_idx').on(table.userId, table.status),
}));

// ============================================================================
// COMPLETED WORKOUTS
// ============================================================================

export const completedWorkouts = sqliteTable('completed_workouts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // Plan reference
  planId: text('plan_id').references(() => workoutPlansMetadata.id, { onDelete: 'set null' }),
  workoutTemplateId: text('workout_template_id'),
  weekNumber: integer('week_number'),
  dayNumber: integer('day_number'),
  
  // Workout details
  workoutType: text('workout_type').notNull(),
  description: text('description'),
  
  // Performance (JSON serialized)
  performance: text('performance', { mode: 'json' }).notNull(), // WorkoutPerformance
  
  // Verification (JSON serialized)
  verification: text('verification', { mode: 'json' }).notNull(), // WorkoutVerification
  
  // Social
  isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(false),
  reactionCount: integer('reaction_count').notNull().default(0),
  
  // Multiplayer
  multiplayerSessionId: text('multiplayer_session_id'),
  
  // Metadata
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  recordedAt: integer('recorded_at', { mode: 'timestamp' }).notNull(), // When workout actually happened
}, (table) => ({
  userIdIdx: index('completed_workouts_user_id_idx').on(table.userId),
  planIdIdx: index('completed_workouts_plan_id_idx').on(table.planId),
  recordedAtIdx: index('completed_workouts_recorded_at_idx').on(table.recordedAt),
  userRecordedIdx: index('completed_workouts_user_recorded_idx').on(table.userId, table.recordedAt),
  publicIdx: index('completed_workouts_public_idx').on(table.isPublic),
}));

export const workoutReactions = sqliteTable('workout_reactions', {
  id: text('id').primaryKey(),
  workoutId: text('workout_id').notNull().references(() => completedWorkouts.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  userName: text('user_name').notNull(),
  reactionType: text('reaction_type').notNull(), // 'fire' | 'strong' | 'clap' | 'heart' | 'smile'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  workoutIdIdx: index('workout_reactions_workout_id_idx').on(table.workoutId),
  userWorkoutIdx: index('workout_reactions_user_workout_idx').on(table.userId, table.workoutId),
}));

// ============================================================================
// COACHING
// ============================================================================

// Conversation snapshots - full conversation lives in UserAgent DO
export const coachingConversations = sqliteTable('coaching_conversations', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // Snapshot data (JSON serialized)
  contextSnapshot: text('context_snapshot', { mode: 'json' }).notNull(), // CoachingContext
  messagesSnapshot: text('messages_snapshot', { mode: 'json' }).notNull(), // Last 50 messages
  checkInsSnapshot: text('check_ins_snapshot', { mode: 'json' }).notNull(), // All check-ins
  
  // Stats
  totalMessages: integer('total_messages').notNull().default(0),
  totalCheckIns: integer('total_check_ins').notNull().default(0),
  pendingCheckIns: integer('pending_check_ins').notNull().default(0),
  
  // Metadata
  startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
  lastMessageAt: integer('last_message_at', { mode: 'timestamp' }).notNull(),
  lastSnapshotAt: integer('last_snapshot_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  userIdIdx: index('coaching_conversations_user_id_idx').on(table.userId),
}));

// ============================================================================
// INTEGRATIONS
// ============================================================================

export const connectedServices = sqliteTable('connected_services', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  serviceType: text('service_type').notNull(), // 'strava' | 'garmin' | 'apple_health' | etc.
  
  // OAuth credentials (ENCRYPTED in application code)
  credentialsEncrypted: text('credentials_encrypted').notNull(), // JSON encrypted
  
  // Permissions (JSON serialized)
  permissions: text('permissions', { mode: 'json' }).notNull(), // ServicePermissions
  
  // Sync status (JSON serialized)
  syncStatus: text('sync_status', { mode: 'json' }).notNull(), // SyncStatus
  
  // Service metadata (JSON serialized)
  metadata: text('metadata', { mode: 'json' }).notNull(), // ServiceMetadata
  
  // State
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  isPaused: integer('is_paused', { mode: 'boolean' }).notNull().default(false),
  
  // Timestamps
  connectedAt: integer('connected_at', { mode: 'timestamp' }).notNull(),
  lastSyncAt: integer('last_sync_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  userIdIdx: index('connected_services_user_id_idx').on(table.userId),
  userServiceIdx: index('connected_services_user_service_idx').on(table.userId, table.serviceType),
  activeIdx: index('connected_services_active_idx').on(table.isActive),
}));

// ============================================================================
// SOCIAL / TEAMS
// ============================================================================

export const teams = sqliteTable('teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  avatarUrl: text('avatar_url'),
  
  // Owner
  ownerId: text('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // Settings
  isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(false),
  maxMembers: integer('max_members').notNull().default(50),
  
  // Stats
  memberCount: integer('member_count').notNull().default(1),
  
  // Metadata
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  ownerIdx: index('teams_owner_idx').on(table.ownerId),
  publicIdx: index('teams_public_idx').on(table.isPublic),
}));

export const teamMembers = sqliteTable('team_members', {
  teamId: text('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // 'owner' | 'admin' | 'member'
  joinedAt: integer('joined_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.teamId, table.userId] }),
  userIdIdx: index('team_members_user_id_idx').on(table.userId),
}));

// ============================================================================
// RELATIONS (for relational queries)
// ============================================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  achievements: many(achievements),
  plans: many(workoutPlansMetadata),
  workouts: many(completedWorkouts),
  reactions: many(workoutReactions),
  coachingConversation: one(coachingConversations, {
    fields: [users.id],
    references: [coachingConversations.userId],
  }),
  connectedServices: many(connectedServices),
  ownedTeams: many(teams),
  teamMemberships: many(teamMembers),
}));

export const completedWorkoutsRelations = relations(completedWorkouts, ({ one, many }) => ({
  user: one(users, {
    fields: [completedWorkouts.userId],
    references: [users.id],
  }),
  plan: one(workoutPlansMetadata, {
    fields: [completedWorkouts.planId],
    references: [workoutPlansMetadata.id],
  }),
  reactions: many(workoutReactions),
}));

export const workoutReactionsRelations = relations(workoutReactions, ({ one }) => ({
  workout: one(completedWorkouts, {
    fields: [workoutReactions.workoutId],
    references: [completedWorkouts.id],
  }),
  user: one(users, {
    fields: [workoutReactions.userId],
    references: [users.id],
  }),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  owner: one(users, {
    fields: [teams.ownerId],
    references: [users.id],
  }),
  members: many(teamMembers),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// TYPE EXPORTS (inferred from schema)
// ============================================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;

export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;

export type PlanTemplate = typeof planTemplates.$inferSelect;
export type NewPlanTemplate = typeof planTemplates.$inferInsert;

export type WorkoutPlanMetadata = typeof workoutPlansMetadata.$inferSelect;
export type NewWorkoutPlanMetadata = typeof workoutPlansMetadata.$inferInsert;

export type CompletedWorkout = typeof completedWorkouts.$inferSelect;
export type NewCompletedWorkout = typeof completedWorkouts.$inferInsert;

export type WorkoutReaction = typeof workoutReactions.$inferSelect;
export type NewWorkoutReaction = typeof workoutReactions.$inferInsert;

export type CoachingConversation = typeof coachingConversations.$inferSelect;
export type NewCoachingConversation = typeof coachingConversations.$inferInsert;

export type ConnectedService = typeof connectedServices.$inferSelect;
export type NewConnectedService = typeof connectedServices.$inferInsert;

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;

export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;