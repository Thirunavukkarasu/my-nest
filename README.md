# My Nest

A monorepo application for managing apartments and tenants in a building.

## Project Structure

This is a monorepo containing:

- **`apps/web`** - Next.js web application (Admin interface + API backend)
- **`apps/mobile`** - Expo mobile application (Resident interface)
- **`packages/shared`** - Shared types, utilities, and constants

## Features

- Add a new flats
- Add a new residents
- List all flats
- List all residents
- Manage Payments
- Manage Maintenance Requests
- Manage Complaints
- Manage Notices

## Technologies

- **Web App**: Next.js, React, Tailwind CSS, DrizzleORM, NextAuth
- **Mobile App**: Expo, React Native, NativeWind
- **Database**: PostgreSQL (Neon)

## Installation

1. Clone the repository

```bash
git clone git@github.com:Thirunavukkarasu/my-nest.git
cd my-nest
```

2. Install dependencies

```bash
npm install
```

## Development

### Web App (Admin + API)

```bash
# Start development server
npm run dev:web

# Or navigate to the web app directory
cd apps/web
npm run dev
```

The web app will be available at `http://localhost:3000`

### Mobile App (Residents)

```bash
# Start Expo development server
npm run dev:mobile

# Or navigate to the mobile app directory
cd apps/mobile
npm start
```

### Database Commands

```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

### Building Android APK

```bash
# Setup Android SDK (first time only)
npm run setup:android

# Build production APK on cloud
npm run build:apk

# Build preview APK on cloud
npm run build:apk:preview

# Build production APK locally
npm run build:apk:local

# Or use the script directly
./scripts/build-android-apk.sh --help
```

See [Scripts Documentation](./scripts/README.md) for more details.

## Environment Variables

Create a `.env.local` file in `apps/web` directory and add:

```bash
POSTGRES_URL=your_postgres_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

For the mobile app, create a `.env` file in `apps/mobile` directory:

```bash
API_URL=http://localhost:3000/api
```

## Architecture

- **Web App (`apps/web`)**: Serves as both the admin dashboard and the API backend
- **Mobile App (`apps/mobile`)**: Consumes the API from the web app for resident-facing features
- **Shared Package (`packages/shared`)**: Contains shared types and utilities used by both apps

## Documentation

All project documentation is available in the [`docs/`](./docs/) folder:

- [Architecture](./docs/architecture/STRUCTURE.md) - Project structure and organization
- [CI/CD](./docs/ci-cd/) - Build and deployment workflows
- [Mobile App](./docs/mobile/) - Mobile app setup and build guides

## API Endpoints

The web app exposes API endpoints at `/api/*`:

- `/api/auth/*` - Authentication endpoints
- `/api/flats` - Flat management
- `/api/residents` - Resident management
- `/api/payments` - Payment management
- `/api/expenses` - Expense management
- `/api/transaction-history` - Transaction history
