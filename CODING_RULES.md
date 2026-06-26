# GetItDone - Coding Rules

These rules apply to every file in this project without exception. When generating or editing code, follow these rules before writing a single line.

---

## Naming conventions

Use camelCase for all variable names, function names, parameter names, and object keys.

```javascript
// correct
const habitId = 'abc123';
const habitLog = { value: 10, note: 'Good session' };
function getHabitById(habitId) {}

// wrong
const habit_id = 'abc123';
const HabitLog = { value: 10 };
function GetHabitById(habit_id) {}
```

For names that contain "Id", the value must be an identifier and not a display value.

Valid:
```javascript
userId = 'clx1a2b3c'
habitId = 'clx4d5e6f'
```

Invalid:
```javascript
userId = 'john_doe'
habitId = 'Morning Run'
```

IDs and display values must never be stored interchangeably.

Use ALL_CAPS with underscores for constants that are fixed values and never reassigned.

```javascript
// correct
const MAX_BIO_LENGTH = 160;
const LEADERBOARD_PAGE_SIZE = 20;
const API_BASE_URL = 'http://localhost:3000';

// wrong
const maxBioLength = 160;
const leaderboardPageSize = 20;
```

Use PascalCase for React component names and for constructor functions.

```javascript
// correct
function HabitCard({ habit, onLog }) {}
function StreakBadge({ count }) {}

// wrong
function habitCard({ habit, onLog }) {}
function streakbadge({ count }) {}
```

---

## Imports

All imports must appear at the top of the file before any other code. No exceptions. Do not import inside functions, inside conditionals, or halfway through a file.

```javascript
// correct
import { useState, useEffect } from 'react';
import HabitCard from './HabitCard';
import { formatDate } from '../utils/formatDate';

function Dashboard() {
  // code here
}

// wrong
function Dashboard() {
  const { useState } = require('react');
  import HabitCard from './HabitCard';
}
```

Group imports in this order with a blank line between each group:
1. External libraries (react, express, prisma, etc.)
2. Internal components
3. Internal utilities and helpers
4. Data and constants

---

## Spacing around operators and punctuation

Always put exactly one space on each side of `=`, `:`, `+`, `-`, `*`, `/`, `===`, `!==`, `=>`, and similar operators.

```javascript
// correct
const total = current + previous;
const isComplete = count === target;
const label = isStreak ? 'On track' : 'Missed';

// wrong
const total=current+previous;
const isComplete=count===target;
```

When defining object properties, put one space after the colon. Do not pad with extra spaces to align values across multiple lines.

```javascript
// correct
const habit = {
  id: habit.id,
  title: habit.title,
  metricLabel: habit.metricLabel,
  targetValue: habit.targetValue,
  frequency: habit.frequency,
  currentStreak: habit.currentStreak ?? 0,
};

// wrong - do not align values with extra spaces
const habit = {
  id:            habit.id,
  title:         habit.title,
  metricLabel:   habit.metricLabel,
};
```

---

## Conditionals

Never write an entire if statement on one line. Always use braces and separate lines even for single-statement bodies.

```javascript
// correct
if (habit.frequency === 'DAILY') {
  return checkDailyStreak(habit);
}

if (isLoggedToday) {
  incrementStreak(habit);
} else {
  resetStreak(habit);
}

// wrong
if (habit.frequency === 'DAILY') return checkDailyStreak(habit);
```

Ternary operators are allowed only for simple value assignments where both outcomes are short plain values. Never nest ternaries. Never use a ternary to choose between two function calls or two JSX elements.

```javascript
// correct
const label = isComplete ? 'Done' : 'Pending';
const colour = isActive ? '#22c55e' : '#94a3b8';

// wrong - nested ternary
const status = isComplete ? 'Done' : isMissed ? 'Missed' : 'Pending';

// correct way to write the above
function getHabitStatus(isComplete, isMissed) {
  if (isComplete) {
    return 'Done';
  }
  if (isMissed) {
    return 'Missed';
  }
  return 'Pending';
}

// wrong - ternary choosing between JSX blocks
const content = isLoading ? <Spinner /> : <Dashboard />;

// correct way
if (isLoading) {
  return <Spinner />;
}
return <Dashboard />;
```

---

## Functions

Use named function declarations for top-level functions. Use arrow functions for callbacks and inline handlers only.

```javascript
// correct - named declaration for top-level
function calculateStreak(logs, frequency) {
  // streak logic
}

// correct - arrow function for callback
const sorted = habits.sort((a, b) => {
  return b.currentStreak - a.currentStreak;
});

// wrong - anonymous arrow for top-level
const calculateStreak = (logs, frequency) => logs.length;
```

Each function should do one thing. If a function is doing more than one distinct job, split it.

---

## Comments

Comment anything that is not immediately obvious from the code itself. Do not comment what the code is doing if the code is already clear. Comment why something is done a certain way.

```javascript
// correct - explains why
// A streak only increments if the log falls within the active frequency window.
// Logging twice in the same window does not double-count - only the first log counts.
function incrementStreakIfEligible(habit, loggedAt) {}

// wrong - explains what, which the code already shows
// increment the streak
incrementStreak(habit);
```

---

## Em dashes

Never use em dashes (—) anywhere in the codebase. Not in comments, not in strings, not in template literals, not in JSX, not in documentation. Use a regular hyphen (-) or rewrite the sentence.

```javascript
// wrong
const label = `${habit.title} — ${habit.metricLabel}`;

// correct
const label = `${habit.title} - ${habit.metricLabel}`;
```

---

## React components

Each component must be in its own file. The file name must match the component name exactly.

Props must be destructured in the function signature.

```javascript
// correct
function HabitCard({ habit, onLog, onEdit }) {
  // code
}

// wrong
function HabitCard(props) {
  const habit = props.habit;
}
```

Do not put multiple components in one file unless one is a tiny sub-component used only by the other and has no reason to exist independently.

---

## Magic numbers and strings

Do not use unexplained numbers or strings directly in logic. Assign them to a named constant first.

```javascript
// correct
const LEADERBOARD_PAGE_SIZE = 20;
const STREAK_RESET_THRESHOLD_HOURS = 48;
const MAX_BIO_LENGTH = 160;

if (hoursSinceLastLog > STREAK_RESET_THRESHOLD_HOURS) {
  resetStreak(habit);
}

// wrong
if (hoursSinceLastLog > 48) {
  resetStreak(habit);
}
```

---

## Error handling

All fetch calls and async Express route handlers must have a try/catch block. Never let a failed API call crash the UI or leave the server without a response.

```javascript
// correct - frontend
async function logHabitEntry(habitId, value) {
  try {
    const response = await fetch(`${API_BASE_URL}/habits/${habitId}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    const data = await response.json();
    setHabit(data);
  } catch (error) {
    console.error('Failed to log habit entry:', error);
    showToast('Could not save your entry. Please try again.', 'error');
  }
}

// correct - backend Express route
router.post('/habits/:id/logs', async (req, res, next) => {
  try {
    const log = await habitService.createLog(req.params.id, req.body);
    return res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
});

// wrong - no error handling
async function logHabitEntry(habitId, value) {
  const response = await fetch(`${API_BASE_URL}/habits/${habitId}/logs`);
  const data = await response.json();
  setHabit(data);
}
```

---

## API layer (frontend)

All API calls must live in `/client/src/api/`. Components and hooks must never call `fetch` directly. They must go through the API layer.

```javascript
// correct - component calls a hook
const { logEntry } = useHabits();
logEntry(habitId, value);

// correct - hook calls the API module
import { createHabitLog } from '../api/habits.api';

// correct - API module calls fetch
async function createHabitLog(habitId, value) {
  try {
    const response = await fetch(`${API_BASE_URL}/habits/${habitId}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    return await response.json();
  } catch (error) {
    throw new Error(`createHabitLog failed: ${error.message}`);
  }
}

// wrong - fetch called directly inside a component
function HabitCard({ habit }) {
  async function handleLog() {
    await fetch(`/habits/${habit.id}/logs`, { method: 'POST' });
  }
}
```

---

## Backend route, controller, service pattern

Every API endpoint must follow the three-layer pattern without exception.

- **Route** (`/server/src/routes/`) -- defines the endpoint and calls the controller. No logic here.
- **Controller** (`/server/src/controllers/`) -- handles the request and response. Calls the service. No business logic here.
- **Service** (`/server/src/services/`) -- contains all business logic and database calls via Prisma. No req/res objects here.

```javascript
// route - habits.routes.js
router.post('/:id/logs', authMiddleware, habitController.createLog);

// controller - habits.controller.js
async function createLog(req, res, next) {
  try {
    const log = await habitService.createLog(req.params.id, req.user.id, req.body);
    return res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
}

// service - habits.service.js
async function createLog(habitId, userId, body) {
  const log = await prisma.habitLog.create({
    data: {
      habitId,
      userId,
      value: body.value,
      note: body.note ?? null,
      loggedAt: new Date(),
    },
  });
  await updateStreak(habitId);
  return log;
}
```

---

## Streak logic

Streak calculation is a core business rule. It must only ever live in `/server/src/utils/streak.js` on the backend and `/client/src/utils/streak.js` for any display-only derivations on the frontend.

Rules:
- A streak increments when a HabitLog is created within the active frequency window (daily = within the current calendar day, weekly = within the current ISO week, monthly = within the current calendar month).
- Logging more than once within the same window does not increment the streak further.
- If a window passes with no log, the streak resets to zero.
- `currentStreak` and `longestStreak` on the Habit model are the single source of truth for streak values. Never calculate streaks ad hoc outside the streak utility.

---

## Auth and JWT

- Access tokens must be short-lived (15 minutes).
- Refresh tokens must be stored in the `RefreshToken` table and rotated on each use.
- The `authMiddleware` must attach `req.user` with at minimum `{ id, email }` after verifying the access token.
- Never pass raw passwords anywhere outside of the auth service. Hash with bcrypt at the service layer before any database write.

---

## Prisma and database

- All database access must go through Prisma. Raw SQL is not permitted except for documented edge cases that Prisma cannot handle, and those must be commented with an explanation.
- Migrations must be generated with `prisma migrate dev` and committed to the repo. Never manually edit the database schema directly.
- The Prisma client must be instantiated once in `/server/src/config/db.js` and imported from there. Never instantiate a new PrismaClient inside a service or route.

---

## Single source of truth

Every piece of business state must have exactly one authoritative owner.

Examples for this project:
- Streak values are owned by the `Habit` table. The frontend displays them but never calculates the authoritative value.
- Task completion state is owned by the `Task` table. Marking complete on the frontend is optimistic UI only and must be confirmed by the backend response.
- Leaderboard rankings are calculated server-side and never derived on the frontend from locally cached data.

Before adding a new state variable, identify:
1. Who owns it?
2. Who may update it?
3. Is it draft state (local only) or business state (must be persisted)?

---

## Async mutation rules

Any function that mutates backend state must:

1. Return a Promise.
2. Await all backend operations.
3. Check response success.
4. Handle failure explicitly.
5. Return meaningful results to callers.

Forbidden:
- Fire-and-forget mutations.
- Updating UI as if a mutation succeeded before backend confirmation (except clearly marked optimistic updates that handle rollback on failure).
- Ignoring backend failures silently.

---

## Save flow rules

If a screen has a Save or Submit button, changes must not be persisted until that button is pressed. Typing into a field or selecting a value must only update local draft state.

Exception: logging a habit entry via the quick-log button is an intentional immediate mutation and is documented as such. It must still await backend confirmation and handle failure.

---

## Race conditions

Never assume one async operation completes before another. Design mutations so the final result is correct regardless of execution order. Use a single authoritative mutation path per business action. Make mutations idempotent where possible.

---

## General

Keep lines under 100 characters where possible. If a line is getting long, break it across multiple lines.

No `console.log` statements in production-bound code. Remove before committing to `main`.

No commented-out blocks of old code left in files. Delete unused code. Git history preserves it if needed.

One blank line between logical sections within a function. Two blank lines between top-level declarations.

---

These rules exist to keep the codebase readable across two developers, make debugging faster, and ensure the project scales cleanly if it grows beyond the MVP. When in doubt, choose more readable over more clever.
