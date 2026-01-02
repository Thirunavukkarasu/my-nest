# Environment Configuration

## Setup

1. Create a `.env` file in the `mobile` directory:

```bash
cp .env.example .env
```

2. Update `.env` with your API base URL:

```env
# For local development
EXPO_PUBLIC_API_URL=http://localhost:3000

# For Vercel deployment
EXPO_PUBLIC_API_URL=https://your-app.vercel.app
```

## Important Notes

- The `EXPO_PUBLIC_API_URL` should **NOT** include `/api` at the end
- The API client automatically adds `/api` prefix to all endpoints
- For Expo, environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the app
- After changing `.env`, restart the Expo development server

## Current Configuration

The app is configured to use:

- Base URL: Set via `EXPO_PUBLIC_API_URL` environment variable
- Default fallback: `http://localhost:3000` (for local development)
