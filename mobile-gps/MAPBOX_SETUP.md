# GPS Mobile App with Mapbox Setup Guide

This React Native app uses Mapbox Maps SDK for GPS functionality. Follow these steps to complete the setup:

## Prerequisites

1. **Get a Mapbox Account**
   - Sign up at [Mapbox](https://account.mapbox.com/auth/signup/)
   - Get your access token from [Access Tokens page](https://account.mapbox.com/access-tokens/)

2. **Configure Mapbox Access Token**
   - Replace `YOUR_MAPBOX_ACCESS_TOKEN` in `/components/GPSMapScreen.tsx` with your actual token
   - For production, consider using environment variables instead of hardcoding the token

3. **Configure Download Token (Android)**
   - In `app.json`, replace `YOUR_MAPBOX_DOWNLOAD_TOKEN` with your download token
   - You can use the same access token or create a separate download token

## Features

- **Real-time GPS tracking**: Shows current location on the map
- **Location permissions**: Properly requests and handles location permissions
- **Interactive map**: Zoom, pan, and rotate functionality
- **Location marker**: Custom marker showing user's position
- **Coordinate display**: Shows exact latitude and longitude
- **Start/Stop tracking**: Toggle continuous location updates
- **Refresh location**: Manually update current position

## Usage

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Run on Android:
   ```bash
   npx expo start --android
   ```

4. The GPS functionality is available in the "GPS" tab

## Development Notes

- The app automatically requests location permissions
- Location tracking uses high accuracy mode
- The map centers on the user's location when first loaded
- Location updates every second when tracking is enabled

## Troubleshooting

1. **Permission Issues**: Make sure location permissions are granted in device settings
2. **Map not loading**: Verify your Mapbox access token is correct
3. **Android build issues**: Ensure download token is set in app.json
4. **iOS location issues**: Check Info.plist permissions are properly configured

## File Structure

- `/components/GPSMapScreen.tsx` - Main GPS/Map component
- `/app/(tabs)/gps.tsx` - GPS tab screen
- `/app/(tabs)/_layout.tsx` - Tab navigation layout
- `app.json` - Expo configuration with Mapbox plugin

## Next Steps

You can extend this app by adding:
- Navigation between locations
- Save favorite locations
- Distance calculation
- Speed tracking
- Route recording
- Offline maps
- Geocoding (address search)
