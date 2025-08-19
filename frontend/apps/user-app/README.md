# CRWDBoltMobile

A React Native mobile application built with Expo and TypeScript, migrated from the original CRWDBolt web application.

## Features

- **Discovery Page**: Interactive map with bar locations and swipeable bar cards
- **Events**: Browse and manage events
- **Profile**: User profile management
- **Account Settings**: Comprehensive account management
- **Bottom Navigation**: Custom navigation with glassmorphism design
- **Dark Theme**: Consistent dark theme throughout the app

## Tech Stack

- **React Native**: Mobile app framework
- **Expo**: Development platform and tools
- **TypeScript**: Type safety
- **React Navigation**: Navigation between screens
- **React Native Maps**: Map functionality
- **React Native Gesture Handler**: Touch gestures
- **React Native Reanimated**: Animations
- **Zustand**: State management
- **React Native Vector Icons**: Icon library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd CRWDBoltMobile
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npx expo start
   ```

5. Run on your preferred platform:
   - Press `a` for Android
   - Press `i` for iOS
   - Press `w` for web

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── discovery/      # Discovery page components
│   │   ├── Shared/     # Shared discovery components
│   │   └── MapView/    # Map view components
│   └── ...
├── screens/            # Screen components
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Configuration

### Google Maps API

To use the map functionality, you need to:

1. Get a Google Maps API key from the Google Cloud Console
2. Update the `app.json` file with your API key:
   ```json
   {
     "expo": {
       "android": {
         "config": {
           "googleMaps": {
             "apiKey": "YOUR_GOOGLE_MAPS_API_KEY_ANDROID"
           }
         }
       }
     }
   }
   ```

## Development

### Adding New Screens

1. Create a new screen component in `src/screens/`
2. Add the screen to the navigation in `App.tsx`
3. Update the navigation types if needed

### State Management

The app uses Zustand for state management. The main store is located in `src/store/index.ts`.

### Styling

The app uses React Native's StyleSheet for styling with a consistent dark theme.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software.

