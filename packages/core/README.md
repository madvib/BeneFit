packages/domain/src/
├── shared/                    # Kernel
│   └── value-objects/
│       ├── workout-activity.ts
│       ├── activity-structure.ts
│       ├── date-range.ts
│       └── user-reference.ts
│
├── identity/                  # Authentication & User Identity
│   ├── aggregates/
│   │   └── auth-user.ts      # Login, password, sessions
│   └── index.ts
│
├── profile/                   # User Profile & Preferences
│   ├── aggregates/
│   │   └── user-profile.ts   # Settings, goals, preferences
│   ├── value-objects/
│   │   ├── fitness-goals.ts
│   │   ├── user-preferences.ts
│   │   └── experience-profile.ts
│   └── index.ts
│
├── planning/                  # Workout Planning
│   ├── aggregates/
│   │   ├── workout-plan.ts
│   │   └── plan-template.ts
│   └── ...
│
├── workouts/                  # Workout Execution & History
│   ├── aggregates/
│   │   ├── completed-workout.ts
│   │   └── workout-session.ts
│   └── ...
│
├── integrations/              # Third-party Connections
│   ├── aggregates/
│   │   └── connected-service.ts
│   ├── value-objects/
│   │   ├── oauth-credentials.ts
│   │   └── sync-status.ts
│   └── index.ts
│
├── coaching/                  # AI Coach Intelligence
│   ├── aggregates/
│   │   └── coaching-conversation.ts
│   ├── value-objects/
│   │   ├── coaching-context.ts
│   │   └── check-in.ts
│   └── index.ts
│
├── social/                    # Teams & Social Features
│   ├── aggregates/
│   │   ├── team.ts
│   │   └── activity-feed.ts
│   └── index.ts
│
└── sponsorship/               # Corporate Sponsorship
    ├── aggregates/
    │   ├── sponsor.ts
    │   └── reward-claim.ts
    └── index.ts