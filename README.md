# My Nest

A simple code colocation project for managing apartments and tenants in a building.

## Project Structure

This project uses a simple folder-based structure:

```
my-nest/
├── web/          # Next.js web application (Admin interface + API backend)
├── mobile/       # Expo mobile application (Resident interface)
├── api/          # Express API server (deployed separately on Vercel)
├── docs/         # Documentation
└── scripts/      # Utility scripts
```

## Features

- Add a new flats
- Add a new residents
- List all flats
- List all residents
- Manage Payments
- Manage Maintenance Requests

## Getting Started

### Web App (Admin)

```bash
# Navigate to web directory
cd web

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The web app will be available at `http://localhost:3000`

### Mobile App (Residents)

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
pnpm install

# Start Expo development server
pnpm start
```

### API Server

```bash
# Navigate to api directory
cd api

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Environment Variables

### Web App

Create a `.env.local` file in `web` directory:

```bash
POSTGRES_URL=your_postgres_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### Mobile App

Create a `.env` file in `mobile` directory:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

## Database Commands

From the `web` directory:

```bash
# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed
```

## Building Android APK

From the `mobile` directory:

```bash
# Build production APK on cloud
pnpm build:android:production

# Build preview APK on cloud
pnpm build:android:preview

# Build locally (requires Android SDK)
pnpm build:android:production:local
```

## Architecture

- **Web App (`web`)**: Serves as both the admin dashboard and the API backend
- **Mobile App (`mobile`)**: Consumes the API from the web app for resident-facing features
- **API (`api`)**: Express API server deployed separately on Vercel

## Documentation

See the [docs](./docs/) directory for detailed documentation:

- [API Documentation](./docs/api/)
- [Architecture](./docs/architecture/)
- [Mobile Development](./docs/mobile/)
- [CI/CD](./docs/ci-cd/)
