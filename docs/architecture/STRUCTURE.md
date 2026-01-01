# Project Structure

This monorepo is organized as follows:

```
my-nest/
├── apps/
│   ├── web/              # Next.js web application (Admin + API)
│   │   ├── src/
│   │   │   ├── app/      # Next.js app router (pages + API routes)
│   │   │   ├── components/
│   │   │   ├── db/       # Database schema, migrations, seeds
│   │   │   ├── lib/      # Utilities and helpers
│   │   │   └── middleware.ts
│   │   ├── public/       # Static assets
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── mobile/           # Expo mobile application (Residents)
│       ├── app/          # Expo Router pages
│       ├── components/
│       ├── assets/
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   └── shared/           # Shared code between web and mobile
│       ├── src/
│       │   ├── types/    # Shared TypeScript types
│       │   └── index.ts
│       └── package.json
│
├── package.json          # Root workspace configuration
└── README.md
```

## Apps

### `apps/web` - Next.js Application
- **Purpose**: Admin dashboard + API backend
- **Tech Stack**: Next.js, React, Tailwind CSS, DrizzleORM, NextAuth
- **Port**: 3000 (default)
- **API Routes**: `/api/*` endpoints accessible by mobile app

### `apps/mobile` - Expo Application
- **Purpose**: Resident-facing mobile app
- **Tech Stack**: Expo, React Native, NativeWind
- **API**: Consumes APIs from `apps/web`

## Packages

### `packages/shared`
Shared TypeScript types, utilities, and constants used by both web and mobile apps.

## Workspace Commands

From the root directory:

```bash
# Web app
npm run dev:web          # Start web dev server
npm run build:web        # Build web app
npm run lint:web        # Lint web app

# Mobile app
npm run dev:mobile       # Start Expo dev server
npm run lint:mobile      # Lint mobile app

# Database (runs in web app context)
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
```

## Development Workflow

1. **Install dependencies**: `npm install` (from root)
2. **Start web app**: `npm run dev:web` or `cd apps/web && npm run dev`
3. **Start mobile app**: `npm run dev:mobile` or `cd apps/mobile && npm start`
4. **API Base URL**: `http://localhost:3000/api` (for mobile app)

