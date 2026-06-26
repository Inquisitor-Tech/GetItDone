# GetItDone: AI Coding Context

**⚠️ IMPORTANT: Read [CODING_RULES.md](./CODING_RULES.md) before writing any code.** That file contains essential conventions for file naming, folder structure, naming patterns, error handling, testing, security, and Git workflow.

---

## Project Overview

GetItDone is a progressive web app (PWA) for habit tracking and goal management. Users create recurring habits (e.g., "read 30 pages daily") and log daily progress, earning streaks for consistency. The app also supports one-time and recurring tasks with priorities and deadlines. A public leaderboard ranks users by current streak length, creating a lightweight social motivation layer. The MVP focuses on core habit logging, task management, and streak mechanics—not social features beyond the leaderboard.

## Stack Summary

- **Frontend**: React 18+ with Vite, Tailwind CSS, PWA manifest, React Router for SPA routing
- **Backend**: Node.js + Express.js, REST API with JWT auth (access + refresh token pattern)
- **Database**: PostgreSQL on AWS RDS, accessed via Prisma ORM with migrations
- **Hosting**: AWS (EC2 or Elastic Beanstalk for backend, S3 + CloudFront for frontend, Route 53 + ACM for domain & SSL)
- **Auth**: JWT tokens; access token (15 min), refresh token (7 days), stored in httpOnly cookies or localStorage
- **Testing**: Jest for backend unit/integration tests, React Testing Library for frontend components
- **Containerization**: Docker for both client and server; docker-compose for local dev (Postgres + optional Redis)

## Monorepo Structure Explanation

The project uses a two-directory monorepo pattern:

```
GetItDone/
├── client/          ← React frontend (Vite, Tailwind, PWA)
├── server/          ← Express backend (REST API, Prisma)
├── package.json     ← Root workspace scripts
├── docker-compose.yml
├── .env.example
├── CLAUDE.md        ← This file
└── README.md
```

**Root-level `package.json`** contains shared scripts:
- `npm run dev` → starts both client and server in parallel (using concurrently)
- `npm run test` → runs all tests (client + server)
- `npm run lint` → lints client and server code

**Client** (`/client`) is a self-contained Vite + React app with its own `package.json`, dependencies, and build output (`dist/`).

**Server** (`/server`) is an Express app with its own `package.json`, Prisma schema, and migrations.

Both directories have their own `.env.example` files; developers copy them to `.env` and `.env.local` for local overrides.

## How to Run the Project Locally

### Prerequisites
- Node.js 18+, npm/yarn
- Docker + Docker Compose
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourorg/getitdone.git
   cd getitdone
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   cd ..
   ```

3. **Start PostgreSQL locally**
   ```bash
   docker-compose up -d
   ```
   This spins up Postgres on `localhost:5432` with credentials from `.env` (default: user=getitdone, password=getitdone).

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   cp client/.env.example client/.env.local
   cp server/.env.example server/.env.local
   ```
   Edit `.env.local` files if needed (URLs, API keys, etc.).

5. **Run Prisma migrations**
   ```bash
   cd server
   npx prisma migrate dev --name init
   ```
   This creates the database schema. Use `prisma migrate reset` to drop and recreate the DB from scratch.

6. **Start the dev servers**
   ```bash
   npm run dev
   ```
   - Client runs on `http://localhost:5173` (Vite dev server)
   - Server runs on `http://localhost:3000` (Express)
   - Both watch for file changes and hot-reload

7. **Optional: Seed the database**
   ```bash
   cd server
   npx prisma db seed
   ```
   (Requires a `prisma/seed.js` file with test data.)

### Stopping
- Press `Ctrl+C` to stop the dev servers.
- `docker-compose down` to stop Postgres.
- `docker-compose down -v` to remove volumes (wipes the DB).

---

## Environment Variable Reference

### Root / Shared (`.env`)
```
NODE_ENV=development
```

### Client (`client/.env.local` or `.env.production`)
```
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=GetItDone
```

**VITE_** prefix required for Vite to expose vars to the browser.

### Server (`server/.env.local` or `.env.production`)
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://getitdone:getitdone@localhost:5432/getitdone
JWT_SECRET=your-super-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxxx
AWS_SECRET_ACCESS_KEY=xxxx
```

**Database URL format**: `postgresql://[user]:[password]@[host]:[port]/[database]`

**JWT Secrets**: Use strong random strings in production (e.g., `openssl rand -hex 32`).

**CORS_ORIGIN**: Comma-separated list of allowed frontend origins; `http://localhost:5173` for local dev, production domain in prod.

---

## Code Conventions

> **Comprehensive guidelines for all code conventions are documented in [CODING_RULES.md](./CODING_RULES.md).** Review that file before writing code.

### File Naming
- **JavaScript/TypeScript files**: `camelCase` (e.g., `auth.service.js`, `userController.js`)
- **React components**: `PascalCase` (e.g., `LoginForm.jsx`, `HabitCard.jsx`)
- **Folders**: `lowercase` (e.g., `services/`, `components/`, `middleware/`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `API_BASE_URL`, `JWT_EXPIRY_MINUTES`)

### Folder Structure Rules

**Backend `/server/src`:**
```
routes/      → Express route definitions only; delegate logic to controllers
controllers/ → Parse request, call services, return response; thin layer
services/    → All business logic; can call other services or Prisma
middleware/  → Auth, validation, error handling, logging
utils/       → Pure functions: JWT, hashing, streak calc, formatters
config/      → Environment loaders, singleton instances (PrismaClient)
prisma/      → schema.prisma + migrations/
constants/   → Error messages, enums, hardcoded values
```

**Frontend `/client/src`:**
```
api/         → HTTP client functions; one file per resource
components/  → React components; split into ui/ (primitives) and layout/ (page structure)
pages/       → Full-page components; one file per route
hooks/       → Custom React hooks; logic isolated from components
context/     → Global state providers (Auth, Notifications)
utils/       → Pure functions: formatDate, validation, constants
```

### How to Add a New API Endpoint

Example: Add `POST /habits/:id/reset-streak` to reset a habit's streak.

1. **Define the route** (`server/src/routes/habits.routes.js`):
   ```javascript
   router.post('/:id/reset-streak', authMiddleware, habitsController.resetStreak);
   ```

2. **Add the controller** (`server/src/controllers/habits.controller.js`):
   ```javascript
   async resetStreak(req, res, next) {
     try {
       const { id } = req.params;
       const userId = req.user.id; // From auth middleware
       const habit = await habitsService.resetStreak(id, userId);
       res.json(response.success(habit, 'Streak reset'));
     } catch (err) {
       next(err);
     }
   }
   ```

3. **Add the service** (`server/src/services/habits.service.js`):
   ```javascript
   async resetStreak(habitId, userId) {
     const habit = await db.habit.findUniqueOrThrow({ where: { id: habitId } });
     if (habit.userId !== userId) throw new ForbiddenError('Not your habit');
     return await db.habit.update({
       where: { id: habitId },
       data: { currentStreak: 0, lastLoggedAt: null },
     });
   }
   ```

4. **Add frontend hook** (`client/src/hooks/useHabits.js`):
   ```javascript
   const resetStreak = async (habitId) => {
     const data = await apiClient.post(`/habits/${habitId}/reset-streak`);
     // Update local state or refetch
     return data;
   };
   ```

5. **Use in a component** (`client/src/pages/HabitDetail.jsx`):
   ```javascript
   const { resetStreak } = useHabits();
   
   const handleReset = async () => {
     await resetStreak(habitId);
     // Show success toast
   };
   ```

### Prisma Migrations in This Project

Migrations are **version-controlled** and stored in `server/prisma/migrations/`.

**Workflow:**
1. **Modify** `server/prisma/schema.prisma` with new models, fields, or relations.
2. **Create a migration**:
   ```bash
   cd server
   npx prisma migrate dev --name <description>
   ```
   Example: `npx prisma migrate dev --name add-habit-goal-field`
3. **Review** the generated SQL in `migrations/[timestamp]_<description>/migration.sql`.
4. **Commit** both the schema and migration files to git.
5. **Deploy** migrations in production via CI/CD pipeline: `npx prisma migrate deploy`.

**Notes:**
- Never manually edit migration files; always use `migrate dev` to generate them.
- `migrate reset` drops and recreates the DB (dev only); never use in production.
- If you need to undo the last migration (dev only): delete the migration folder and use `migrate dev`.

---

## Key Business Logic Notes

### Streak Calculation

A **streak** increments every time a user logs a value for a habit *within the expected frequency window*.

- **Daily habit**: Increment streak if logged within the last 24 hours from `lastLoggedAt`.
- **Weekly habit**: Increment streak if logged within the last 7 days.
- **Monthly habit**: Increment streak if logged within the last 30 days.

**Reset condition**: If the user misses the frequency window, the streak resets to 0 on the next log attempt. The `currentStreak` and `longestStreak` fields track this.

**Implementation** (`server/src/utils/streak.js`):
```javascript
export function calculateStreakDelta(habit, now = new Date()) {
  const { frequency, lastLoggedAt, currentStreak } = habit;
  const hoursAgo = (now - lastLoggedAt) / (1000 * 60 * 60);
  
  const maxHours = frequency === 'DAILY' ? 24 : frequency === 'WEEKLY' ? 168 : 720;
  
  if (hoursAgo <= maxHours) {
    return currentStreak + 1; // Increment
  }
  return 1; // Reset, start new streak
}
```

On `POST /habits/:id/log`, the service calls this function, updates `currentStreak`, and sets `longestStreak = Math.max(longestStreak, currentStreak)`.

### Recurring Tasks

A **recurring task** is not deleted when marked complete; instead, a new "completion requirement" is implicitly generated for the next period.

**Data model**: A single `Task` row with `isRecurring=true`, `recurrenceType=DAILY|WEEKLY|MONTHLY`, and `completedAt` timestamp (most recent completion).

**Behavior on completion** (`POST /tasks/:id/complete`):
1. Set `completedAt = now`.
2. Leave `isComplete=true` (or toggle to false to allow re-completion in the same period; design choice).
3. Don't delete the row; the task remains in the user's list.
4. On the next `GET /tasks`, filter logic shows "is the recurring task overdue?" based on `recurrenceType` + `completedAt`.

**Frontend logic** (in `useTasksHook` or a service):
```javascript
function isTaskOverdue(task) {
  if (!task.isRecurring || !task.completedAt) return false;
  const daysSince = (Date.now() - task.completedAt) / (1000 * 60 * 60 * 24);
  
  const threshold =
    task.recurrenceType === 'DAILY' ? 1 :
    task.recurrenceType === 'WEEKLY' ? 7 :
    task.recurrenceType === 'MONTHLY' ? 30 : Infinity;
  
  return daysSince > threshold;
}
```

### Leaderboard Ranking

The **public leaderboard** ranks users by:
1. **Current streak length** (descending); highest active streak wins.
2. **Ties broken by**: Total completed tasks (descending).
3. **Ties broken by**: Account age (oldest first, as a tiebreaker).

**Query logic** (`server/src/services/leaderboard.service.js`):
```javascript
async getLeaderboard(limit = 100) {
  return await db.user.findMany({
    take: limit,
    orderBy: [
      { habits: { _count: 'desc' } }, // Habit count as proxy for engagement
      // Or fetch computed current streak from HabitLog aggregates
    ],
    select: { id, username, displayName, avatarUrl, habits: { select: { currentStreak } } },
  });
}
```

(Exact implementation depends on whether you compute streaks in the DB or app layer.)

**Privacy**: Only public data (username, streak, task count) is exposed. Email, password hash, and personal notes are never returned.

---

## Testing Approach

### Backend (Jest)

**Unit tests** (`server/tests/unit/`):
- Test pure functions in isolation: `jwt.js`, `streak.js`, `hash.js`.
- Mock Prisma calls; don't use a real DB.
- Example: `server/tests/unit/utils/streak.test.js`
  ```javascript
  describe('calculateStreakDelta', () => {
    it('increments streak if logged within window', () => {
      const habit = { frequency: 'DAILY', lastLoggedAt: new Date(Date.now() - 12*3600e3), currentStreak: 5 };
      expect(calculateStreakDelta(habit)).toBe(6);
    });
    
    it('resets streak if missed window', () => {
      const habit = { frequency: 'DAILY', lastLoggedAt: new Date(Date.now() - 25*3600e3), currentStreak: 5 };
      expect(calculateStreakDelta(habit)).toBe(1);
    });
  });
  ```

**Integration tests** (`server/tests/integration/`):
- Test full request flows with a real test DB (or in-memory SQLite for speed).
- Example: `server/tests/integration/auth.integration.test.js`
  ```javascript
  describe('POST /auth/register', () => {
    it('creates a user and returns tokens', async () => {
      const res = await request(app).post('/auth/register').send({
        email: 'test@example.com',
        password: 'SecurePass123!',
      });
      expect(res.status).toBe(201);
      expect(res.body.accessToken).toBeDefined();
    });
  });
  ```

**Commands**:
```bash
npm test                  # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Generate coverage report
```

### Frontend (React Testing Library)

**Component tests** (`client/src/__tests__/components/`):
- Test user interactions and rendered output.
- Example: `client/src/__tests__/components/HabitCard.test.jsx`
  ```javascript
  import { render, screen, fireEvent } from '@testing-library/react';
  import HabitCard from '../../components/HabitCard';
  
  test('displays habit title and allows logging', () => {
    const habit = { id: '1', title: 'Read', currentStreak: 5 };
    const onLog = jest.fn();
    
    render(<HabitCard habit={habit} onLog={onLog} />);
    expect(screen.getByText('Read')).toBeInTheDocument();
    expect(screen.getByText('5-day streak')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Log'));
    expect(onLog).toHaveBeenCalled();
  });
  ```

**Commands**:
```bash
npm run test             # Run tests
npm run test:coverage    # Coverage report
```

---

## Git Workflow

### Branch Strategy

1. **Main branch** (`main`): Production-ready code. Protected; requires PR review.
2. **Feature branches**: Branch off `main` with naming convention: `feat/habit-analytics`, `fix/streak-reset-bug`, `chore/deps-update`.
3. **PR process**: 
   - Create a PR against `main`.
   - Require at least one review (code quality, correctness, testing).
   - All CI checks (tests, linting) must pass.
   - Squash and merge PRs to keep history clean (optional; can use conventional merge commits).

### Conventional Commits

Enforce commit messages with prefixes:

- `feat:` New feature (e.g., `feat: add habit goal tracking`)
- `fix:` Bug fix (e.g., `fix: reset streak on missed day`)
- `chore:` Dependency updates, tooling (e.g., `chore: upgrade tailwind to v4`)
- `docs:` Documentation (e.g., `docs: update streak calculation explanation`)
- `test:` Tests (e.g., `test: add unit tests for jwt verification`)
- `style:` Code style, formatting (e.g., `style: format habitService.js`)
- `refactor:` Code refactoring without feature/bug changes (e.g., `refactor: extract habit streak logic to util`)

**Tools to enforce**:
- Use `commitlint` + husky hooks in `package.json` to validate on commit.
- Example root `package.json`:
  ```json
  {
    "husky": {
      "hooks": {
        "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
      }
    }
  }
  ```

### Code Review Checklist

Before approving a PR, ensure:
- ✅ Tests added/updated (unit or integration).
- ✅ No console.log or debug statements left in.
- ✅ Database migration (if schema changed) is included.
- ✅ Follows code conventions (naming, folder structure).
- ✅ Security: no hardcoded secrets, proper input validation, no SQL injection risks.
- ✅ Performance: no N+1 queries, reasonable data fetching.

---

## Summary

This is a full-stack monorepo for a habit and goal tracking PWA. Follow the layered backend structure (routes → controllers → services), use the Prisma schema as the source of truth for the data model, and keep frontend components reusable and testable. Always run migrations through Prisma, test both layers, and use conventional commits. The goal is a maintainable, scalable codebase ready for AWS deployment.

---

## Git workflow

You may use `git diff`, `git status`, `git log`, and similar read-only commands freely. You may not:

- Commit to the repository
- Create or delete branches
- Merge branches
- Submit pull requests
- Push or force-push to any remote

These actions require explicit instruction from the user or their collaborator. Only the two project owners may manage the repository's Git state.

---

These rules exist to keep the codebase readable across two developers, make debugging faster, and ensure the project scales cleanly if it grows beyond the MVP. When in doubt, choose more readable over more clever.
