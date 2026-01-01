# My Nest - Apartment Management System 🏠

My Nest is a comprehensive apartment management application built for **RR Enclave**, designed to manage 40 flats across 5 floors. The app helps property managers and residents efficiently handle various apartment management tasks.

## Features

- **Flats Management** - View and manage all 40 flats organized by floor (1-5)
- **Residents Management** - Add and manage owners and tenants with their contact information
- **Payments** - Track maintenance payments and payouts with status tracking
- **Complaints** - Submit and manage resident complaints with status updates

## Tech Stack

- **Framework**: [Expo](https://expo.dev) with [Expo Router](https://docs.expo.dev/router/introduction/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app on your mobile device (for testing) or Android/iOS emulator

### Installation

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the development server

   ```bash
   npm start
   ```

3. Run on your preferred platform

   ```bash
   # Android
   npm run android

   # iOS
   npm run ios

   # Web
   npm run web
   ```

## Project Structure

```
├── app/                    # App screens and routes
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home dashboard
│   │   └── explore.tsx    # Explore screen
│   ├── login.tsx          # Login screen
│   ├── flats.tsx          # Flats management
│   ├── residents.tsx      # Residents management
│   ├── payments.tsx        # Payments tracking
│   └── complaints.tsx      # Complaints management
├── components/             # Reusable components
├── types/                  # TypeScript type definitions
├── assets/                 # Images and static assets
├── global.css             # Global Tailwind CSS styles
└── tailwind.config.js     # Tailwind configuration
```

## Key Modules

### Flats
- View all flats organized by floor
- Add new flats with floor number and flat number
- Track occupancy status (occupied/vacant)

### Residents
- Add residents (owners or tenants)
- View resident details with contact information
- Filter by resident type

### Payments
- Track maintenance payments
- Manage payouts
- Filter by payment type and status
- View payment history

### Complaints
- Submit new complaints
- Track complaint status (open/resolved/closed)
- View complaint history

## Configuration

### NativeWind Setup
The project uses NativeWind v4 for styling. Configuration files:
- `tailwind.config.js` - Tailwind CSS configuration
- `metro.config.js` - Metro bundler configuration for CSS processing
- `babel.config.js` - Babel configuration with NativeWind preset
- `global.css` - Global CSS file with Tailwind directives

## Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint

## Building for Production

To create a production build:

```bash
# Android
npx expo build:android

# iOS
npx expo build:ios
```

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [React Native Documentation](https://reactnative.dev/)

## License

Private project for RR Enclave apartment management.
