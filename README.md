# GetItDone

A progressive web app (PWA) for tracking habits and achieving goals through consistent daily actions and public accountability.

---

## Tech Stack

![React](https://img.shields.io/badge/React-18.0+-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0+-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.0+-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.0+-2D3748?logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-enabled-2496ED?logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-hosted-FF9900?logo=amazon-aws&logoColor=white)

---

## Features

### Core Habit Tracking
- 📊 Create daily, weekly, or monthly habits with custom metrics (e.g., "pages read", "minutes exercised")
- 🔥 Automatic streak tracking—streaks increment when logged within the frequency window, reset if missed
- 📈 View detailed habit history with logs, analytics, and progress visualization
- 🎯 Set and track personal best streaks

### Task Management
- ✅ Create one-time tasks with optional deadlines and priority levels (High, Medium, Low)
- 🔄 Create recurring tasks (daily, weekly, monthly) that auto-generate completion requirements
- 📅 Filter and sort tasks by status, priority, and due date
- 🏷️ Mark tasks complete without deleting (recurring tasks remain active)

### Public Leaderboard
- 🏆 Ranked leaderboard showing users with the longest active streaks
- 👥 View other users' public profiles and their streak progress
- 🌍 Lightweight social motivation without invasive features

### Account & Profile
- 🔐 Secure JWT-based authentication with access + refresh tokens
- 👤 Create a public profile with display name, bio, and avatar
- ⚙️ Manage account settings, privacy, and notification preferences
- 📱 PWA support—install on mobile as a native-like app

### Data & Notifications
- 💾 All data synced to PostgreSQL with automatic migrations
- 📲 Optional in-app notifications for habit reminders and leaderboard updates
- 🌐 Offline-ready PWA cache strategy for partial offline functionality

---

## Local Setup

### Prerequisites
- **Node.js** 18+ and **npm/yarn**
- **Docker** and **Docker Compose**
- **Git**

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourorg/getitdone.git
   cd getitdone
   ```

2. **Install root and workspace dependencies**
   ```bash
   npm install
   cd client && npm install && cd ..
   cd server && npm install && cd ..
   ```

3. **Start PostgreSQL container**
   ```bash
   docker-compose up -d
   ```
   (Postgres runs on `localhost:5432` with default user `getitdone`, password `getitdone`)

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   cp client/.env.example client/.env.local
   cp server/.env.example server/.env.local
   ```
   Edit `.env.local` files if needed (API URLs, secrets, etc.).

5. **Run Prisma migrations and seed data**
   ```bash
   cd server
   npx prisma migrate dev --name init
   npx prisma db seed  # Optional: populate test data
   cd ..
   ```

6. **Start the dev servers**
   ```bash
   npm run dev
   ```
   - **Frontend**: http://localhost:5173 (Vite dev server with HMR)
   - **Backend**: http://localhost:3000 (Express server)
   - Both watch for file changes and hot-reload

7. **Stop the servers**
   ```bash
   Ctrl+C
   docker-compose down         # Stop Postgres
   docker-compose down -v      # Stop Postgres and clear volumes
   ```

---

## Folder Structure Overview

```
GetItDone/
├── client/                     ← React frontend (Vite + Tailwind)
│   ├── public/                 ← Static assets, PWA icons, manifest.json
│   ├── src/
│   │   ├── components/         ← React components (ui/ and layout/)
│   │   ├── pages/              ← Full-page components (routes)
│   │   ├── hooks/              ← Custom React hooks
│   │   ├── context/            ← Global state (Auth, Notifications)
│   │   ├── api/                ← HTTP client functions
│   │   ├── utils/              ← Utilities (formatDate, validation, constants)
│   │   ├── App.jsx             ← Route definitions
│   │   └── main.jsx            ← Entry point
│   ├── Dockerfile              ← Multi-stage build for production
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                     ← Express backend (REST API)
│   ├── src/
│   │   ├── routes/             ← Express route definitions
│   │   ├── controllers/        ← Request handlers
│   │   ├── services/           ← Business logic
│   │   ├── middleware/         ← Auth, validation, error handling
│   │   ├── prisma/             ← Prisma schema + migrations/
│   │   ├── utils/              ← JWT, hashing, streak logic, formatters
│   │   ├── config/             ← Environment and DB config
│   │   ├── app.js              ← Express app setup
│   │   └── server.js           ← Entry point
│   ├── tests/                  ← Jest unit and integration tests
│   ├── Dockerfile              ← Multi-stage build for production
│   └── package.json
│
├── docker-compose.yml          ← Postgres + optional Redis for local dev
├── .env.example                ← Template for root env vars
├── package.json                ← Root workspace, shared scripts
├── CLAUDE.md                   ← AI assistant context & architecture
├── CODING_RULES.md             ← Code conventions & standards (READ BEFORE CODING)
└── README.md                   ← This file
```

---

## API Overview

All endpoints return a standardized response format. See endpoint details below.

### Authentication (`/auth`)
- `POST /auth/register` — Create new user (email, password)
- `POST /auth/login` — Login user (email, password)
- `POST /auth/refresh` — Refresh access token using refresh token
- `POST /auth/logout` — Invalidate refresh token

### Users (`/users`)
- `GET /users/me` — Get current logged-in user's profile
- `PUT /users/me` — Update current user's profile (name, bio, avatar)
- `GET /users/:id` — Get public profile of another user

### Tasks (`/tasks`)
- `GET /tasks` — List user's tasks (paginated, filterable)
- `POST /tasks` — Create new task
- `PUT /tasks/:id` — Update task details
- `DELETE /tasks/:id` — Delete task
- `POST /tasks/:id/complete` — Mark task complete (recurring tasks stay active)

### Habits (`/habits`)
- `GET /habits` — List user's habits
- `POST /habits` — Create new habit
- `PUT /habits/:id` — Update habit (title, frequency, target)
- `DELETE /habits/:id` — Delete habit
- `POST /habits/:id/log` — Log a value for the habit (triggers streak calc)
- `POST /habits/:id/reset-streak` — Manually reset habit streak (admin or owner only)

### Logs (`/logs`)
- `GET /logs/habit/:habitId` — Get all logs for a specific habit
- `DELETE /logs/:id` — Delete a single log entry

### Leaderboard (`/leaderboard`)
- `GET /leaderboard` — Get top 100 users by current streak
- `GET /leaderboard/user/:userId` — Get a specific user's rank and stats

---

## Contributing

### Git Workflow

1. **Create a feature branch** off `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make changes**, add tests, and commit with **Conventional Commits**:
   ```bash
   git commit -m "feat(habits): add goal tracking feature"
   git commit -m "fix(auth): prevent token refresh loop"
   ```

3. **Push and create a Pull Request**:
   ```bash
   git push origin feat/your-feature-name
   ```

4. **Code Review**: At least one approval required before merging.

5. **Merge** to `main` (squash or rebase; CI checks must pass).

### Conventional Commits

Use prefixes to categorize changes:
- `feat:` New feature
- `fix:` Bug fix
- `chore:` Tooling, deps, config
- `docs:` Documentation
- `test:` Test updates
- `refactor:` Code refactoring (no feature/bug)
- `style:` Formatting and linting

**Example:**
```
feat(leaderboard): rank users by streak length

- Add streak-based leaderboard query
- Display top 100 users on public page
- Show user's current rank in profile

Closes #42
```

### Code Standards

**Before writing code, read [CODING_RULES.md](./CODING_RULES.md).** It covers:
- File naming conventions (camelCase, PascalCase)
- Folder structure rules (routes → controllers → services)
- Naming patterns (const, boolean prefixes, Prisma conventions)
- Error handling (custom error classes)
- Testing requirements (Jest, React Testing Library)
- Security rules (JWT, input validation, authorization)
- Git commit standards

### Testing

- **Backend**: `npm run test` in `/server` (Jest)
- **Frontend**: `npm run test` in `/client` (React Testing Library)
- **All tests**: `npm run test` from root

All PRs must include tests. Minimum coverage: 70% services, 50% controllers.

---

## Deployment

### Overview

GetItDone is designed for AWS deployment:

- **Frontend**: Build optimized static assets and deploy to **S3** with **CloudFront** CDN
- **Backend**: Deploy to **EC2** or **Elastic Beanstalk** with auto-scaling
- **Database**: **PostgreSQL on AWS RDS** with automated backups and failover
- **Domain & SSL**: **Route 53** DNS + **ACM** certificate for HTTPS
- **CI/CD**: GitHub Actions or CodePipeline to automate builds and deployments

### Deployment Steps (Placeholder)

1. **Build frontend**:
   ```bash
   cd client
   npm run build  # Creates dist/
   ```

2. **Build backend** Docker image and push to ECR:
   ```bash
   cd server
   docker build -t getitdone-api:latest .
   aws ecr get-login-password | docker login --username AWS --password-stdin <ECR_URI>
   docker tag getitdone-api:latest <ECR_URI>/getitdone-api:latest
   docker push <ECR_URI>/getitdone-api:latest
   ```

3. **Deploy frontend to S3 + CloudFront**:
   ```bash
   aws s3 sync client/dist s3://getitdone-web --delete
   aws cloudfront create-invalidation --distribution-id <DIST_ID> --paths "/*"
   ```

4. **Deploy backend to Elastic Beanstalk**:
   ```bash
   eb deploy --message "Deploy API v1.2"
   ```

5. **Run database migrations** (RDS):
   ```bash
   npx prisma migrate deploy
   ```

### Environment Variables for Production

Set these in AWS Secrets Manager or Elastic Beanstalk environment:
- `NODE_ENV=production`
- `DATABASE_URL=postgresql://[user]:[pass]@[rds-endpoint]:5432/getitdone_prod`
- `JWT_SECRET=<strong-random-key>`
- `JWT_REFRESH_SECRET=<strong-random-key>`
- `CORS_ORIGIN=https://getitdone.com`
- `AWS_REGION=us-east-1`

---

## Support & Questions

- 📖 **Architecture & Context**: See [CLAUDE.md](./CLAUDE.md)
- 📝 **Code Conventions**: See [CODING_RULES.md](./CODING_RULES.md)
- 🐛 **Bug Reports**: Open an issue on GitHub
- 💬 **Discussions**: Use GitHub Discussions for feature requests

---

## License

This project is proprietary. All rights reserved.

---