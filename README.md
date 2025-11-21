# मोटापा कम ऐप - Weight Loss Tracker

A basic React Native Expo mobile application for tracking weight loss and fitness goals.

## Features

- **Home Screen**: Dashboard with weight loss statistics
- **Profile Screen**: User profile and progress tracking
- **Settings Screen**: App preferences and information
- **Bottom Tab Navigation**: Easy navigation between screens
- **Hindi & English Support**: Bilingual interface

## Project Structure

```
motapa-kam-app/
├── App.js                 # Main app entry point with navigation
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── babel.config.js       # Babel configuration
├── screens/
│   ├── HomeScreen.js     # Home/Dashboard screen
│   ├── ProfileScreen.js  # User profile screen
│   └── SettingsScreen.js # Settings screen
└── README.md             # This file
```

## Installation

1. Make sure you have Node.js and npm installed
2. Install Expo CLI:

   ```bash
   npm install -g expo-cli
   ```

3. Install project dependencies:
   ```bash
   npm install
   ```

## Running the App

### Start Development Server

```bash
npm start
```

### Run on Android

```bash
npm run android
```

### Run on iOS

```bash
npm run ios
```

### Run on Web

```bash
npm run web
```

## Dependencies

- **react**: JavaScript library for building user interfaces
- **react-native**: Framework for building native mobile apps
- **expo**: Framework and platform for universal React applications
- **@react-navigation**: Navigation library for React Native
- **react-native-screens**: Native navigation primitives

## Quick Start Guide

1. Start the development server: `npm start`
2. Scan the QR code with Expo Go app (iOS/Android)
3. The app will load in the Expo Go app
4. Navigate between Home, Profile, and Settings tabs

## Next Steps

To expand this app, you can:

- Add weight tracking functionality
- Implement data persistence with AsyncStorage
- Add charts and graphs for progress visualization
- Integrate with health APIs
- Add user authentication
- Create workout tracking features

## License

MIT

## Author

Your Name
