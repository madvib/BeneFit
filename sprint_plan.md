# Sprint Plan: Live Demo Readiness

## Overview

**Goal**: Production-ready live demo with rich seed data, complete AI coach, and verified UI states via Storybook.
**Timeline**: 2-3 weeks (prioritized by demo impact)

---

## 1. Use Case Status & UI Gap Analysis

> [!IMPORTANT] > **Status Check**: Comprehensive review of all 29 Use Cases.
> **Focus**: Identifying UI gaps to be filled via Storybook.

### Training Domain (19)

| Use Case                        | Backend | UI Impl | Storybook | Gaps/Notes                                             |
| ------------------------------- | :-----: | :-----: | :-------: | ------------------------------------------------------ |
| `create-user-profile`           |   ✅    |   ⚠️    |    ❌     | **P1**. Merge with Plan Gen. Make skippable.           |
| `get-profile`                   |   ✅    |   ✅    |    ❌     | Basic view exists.                                     |
| `get-user-stats`                |   ✅    |   ✅    |    ❌     | Needs visual polish.                                   |
| `update-preferences`            |   ✅    |   ✅    |    ❌     | Settings form exists.                                  |
| `update-fitness-goals`          |   ✅    |   ✅    |    ❌     | Part of settings.                                      |
| `update-training-constraints`   |   ✅    |   ✅    |    ❌     | Part of settings.                                      |
| `generate-plan-from-goals`      |   ✅    |   ⚠️    |    ❌     | **P0**. Shared UI needed for Onboarding & Plan Page.   |
| `get-current-plan`              |   ✅    |   ✅    |    ❌     | **P0**. Needs "Empty" & "Paused" states.               |
| `activate-plan`                 |   ✅    |   ✅    |    ❌     | Button state.                                          |
| `pause-plan`                    |   ✅    |   ✅    |    ❌     | Modal exists, needs polish.                            |
| `adjust-plan-based-on-feedback` |   ✅    |   ⚠️    |    ❌     | UI missing.                                            |
| `get-todays-workout`            |   ✅    |   ✅    |    ❌     | **P2**. Dashboard widget.                              |
| `get-upcoming-workouts`         |   ✅    |   ✅    |    ❌     | List view exists.                                      |
| `get-workout-history`           |   ✅    |   ✅    |    ❌     | **P0**. Landing page (Activities). Needs "Crisp" feed. |
| `start-workout`                 |   ✅    |   ✅    |    ❌     | **P3**. Deprioritized (Manual Input > Live Tracker).   |
| `complete-workout`              |   ✅    |   ⚠️    |    ❌     | **P2**. Needs simple form for manual entry.            |
| `skip-workout`                  |   ✅    |   ✅    |    ❌     | Modal exists.                                          |
| `join-multiplayer-workout`      |   ✅    |   ⚠️    |    ❌     | Future.                                                |
| `add-workout-reaction`          |   ✅    |   ⚠️    |    ❌     | UI missing.                                            |

### Coach Domain (6)

| Use Case                     | Backend | UI Impl | Storybook | Gaps/Notes                                         |
| ---------------------------- | :-----: | :-----: | :-------: | -------------------------------------------------- |
| `send-message-to-coach`      |   ✅    |   ✅    |    ❌     | **P0**. Critical Demo Flow. Needs all chat states. |
| `get-coaching-history`       |   ✅    |   ✅    |    ❌     | Part of Chat View.                                 |
| `generate-weekly-summary`    |   ✅    |   ⚠️    |    ❌     | Email/Feed item?                                   |
| `respond-to-check-in`        |   ✅    |   ⚠️    |    ❌     | In-chat interactive elements.                      |
| `dismiss-check-in`           |   ✅    |   ⚠️    |    ❌     | Swipe/Close UI.                                    |
| `trigger-proactive-check-in` |   ✅    |   NA    |    NA     | Backend only trigger.                              |

### Integrations Domain (4)

| Use Case                 | Backend | UI Impl | Storybook | Gaps/Notes                         |
| ------------------------ | :-----: | :-----: | :-------: | ---------------------------------- |
| `connect-service`        |   ✅    |   ⚠️    |    ❌     | **P1**. Settings page integration. |
| `disconnect-service`     |   ✅    |   ⚠️    |    ❌     | Button state.                      |
| `get-connected-services` |   ✅    |   ⚠️    |    ❌     | List view.                         |
| `sync-service-data`      |   ✅    |   ⚠️    |    ❌     | Manual sync button?                |

---

## 2. Storybook: Use Case State Engineering (P0) 📚

**Goal**: Drive UI development by building "Hardenable" stories for complex use cases.
**Priorities**: Landing Page (Activities), Coach Chat, Plan Generation.

### Phase 1: Critical Demo Views (Week 1)

#### 1. Coach Chat (High Priority) 🤖

- **Location**: `apps/web/src/app/user/(chat)/coach`
- **Component**: `ChatView`
- **States**:
  - `EmptyHistory`: "Start chatting with your AI coach..."
  - `Conversation`: Rich message bubbles, timestamps, avatars.
  - `Typing`: AI typing indicators.
  - `InteractiveCheckIn`: Embedded form/buttons within chat stream.

#### 2. Activity Feed (Landing Page) 🏠

- **Location**: `apps/web/src/app/user/(dashboard)/activities`
- **Component**: `ActivityFeed` / `WorkoutListTile`
- **States**:
  - `Feed`: Crisp list of recent activities (synced & manual).
  - `Empty`: "Connect a service or log a workout."
  - `Loading`: Skeleton placeholders.

#### 3. Unified Plan Generation 📅

- **Location**: `apps/web/src/lib/components/plan-wizard` (Shared)
- **Strategy**: Refactor Onboarding & Plan Page to use same "Plan Wizard".
- **States**:
  - `GoalSelection`: Visual cards.
  - `ConstraintInput`: Equipment/Injuries.
  - `Generating`: AI "thinking" animation.
  - `Review`: Proposed plan summary before acceptance.

### Phase 2: Secondary Views (Week 2)

- [ ] **Manual Workout Entry**: Simple form to log a session (replaces Live Tracker for demo).
- [ ] **Onboarding Refactor**: Wrap "Unified Plan Generation" in a skippable modal.
- [ ] **Settings/Integrations**: Connect Strava/Garmin UI.

---

## 3. Rich Seed Data Strategy (P0) 🌱

**Goal**: Hydrate the app with deep history to allow "Time Travel" demoing.
**Command**: `nx run-many -t seed`

### Plan

Leverage `SEED_PERSONAS` in `packages/shared` to drive logic.

### Tasks

- [ ] **Update Seed Scripts**:
  - Ensure `nx run-many -t seed` targets the correct services.
  - `services/training`: Generate 90 days of workout history for `USER_001`.
  - `services/coach`: Generate 2-3 weeks of chat history (conversations, not just single messages).
  - `services/social`: Generate reaction/feed history.
- [ ] **Validate Journeys**: Ensure each Persona looks "Lived In" upon login.

**Effort**: 2 days

---

## 4. AI Coach Integration (P1) 🤖

**Goal**: Move from "Mocked" to "Real Intelligence".
**Dependency**: Do this _alongside_ Storybook (Storybook helps verify the "Typing" and "Streaming" UI states).

### Implementation

**Architecture**: Cloudflare Agents via Gateway.

### Tasks

- [ ] **Gateway**: WebSocket route `/chat/stream`.
- [ ] **Service**: Agent Worker implementation.
- [ ] **UI**: Connect Chat Component to WebSocket.
- [ ] **Storybook**: Add `MockWebSocket` story to test streaming UI without real backend.

**Effort**: 2-3 days

---

## 5. Persistence Refactor (P1) 🗄️

**Goal**: Correct architecture boundaries.

### Migration Map

1. **`discovery_index`** -> `apps/services/discovery` (New Service)
2. **`static_content`** -> `apps/services/content`
3. **`activity_stream`** -> `apps/services/social`

### Tasks

- [ ] Create `apps/services/discovery`.
- [ ] Move code & dependencies.
- [ ] Update `nx.json` / `workspace.json`.

**Effort**: 1-2 days

---

## Priority Matrix

### P0 (Immediate - Week 1)

1. 📚 **Storybook: Coach Chat** (States: Typing, History, Check-ins)
2. 📚 **Storybook: Activity Feed** (The "Landing Page")
3. 📚 **Storybook: Plan Generation** (Shared Wizard)
4. 🌱 **Comprehensive Seed Data**

### P1 (Week 1-2)

5. 🤖 **AI Integration** (Real Agents + WS)
6. 🗄️ **Persistence Refactor**
7. 🛠️ **Onboarding Refactor** (Skippable + Shared UI)

---
