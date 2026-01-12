# TransIntel - Intelligent Translation App

TransIntel is a powerful AI-powered translation app built with Expo and React Native, featuring support for 110+ languages with intelligent features like auto-detection, synonym suggestions, and file translation.

## ✨ Features

- 🌍 **110+ Languages** - Comprehensive language support
- 🔍 **Auto-Detection** - Automatically detect source language
- 💡 **Smart Alternatives** - Multiple translation options with synonyms
- 📄 **File Translation** - Translate text from images, PDFs, and audio
- 🌐 **RTL Support** - Full support for Arabic, Hebrew, Persian, etc.
- ⚡ **AI-Powered** - Uses Google Gemini AI for accurate translations
- 🎨 **Dark Mode** - Beautiful light and dark themes
- 💾 **Saved Preferences** - Remembers your language selections

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Expo CLI installed globally: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator
- Google Gemini API key

### Installation

1. **Clone and install frontend dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment**:
   - Create `backend/.env` file
   - Add your Gemini API key: `GEMINI_API_KEY=your_key_here`

4. **Update API URL** (if needed):
   - In `frontend/app/index.tsx`, update the API URL from `https://transintel.onrender.com` to your backend URL

### Running the App

1. **Start the backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend** (in a new terminal):
   ```bash
   cd frontend
   npm start
   ```

3. **Run on device**:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on physical device

## 📁 Project Structure

```
frontend/
  app/
    index.tsx          # Main translation screen
    _layout.tsx        # Root layout with theme
    (tabs)/            # Tab navigation
  components/
    CustomAlert.tsx    # Custom alert dialogs
    SettingsModal.tsx  # Settings screen
  constants/
    colors.ts          # Theme colors
  contexts/
    ThemeContext.tsx   # Theme management
  services/
    storage.ts         # Local storage utilities

backend/
  server.js            # Express server with Gemini AI integration
  .env                 # Environment variables (create this)

Website/
  index.html           # Landing page
  policy.html          # Privacy policy
  terms.html           # Terms of use
```
  app.ts               # TypeScript type definitions
Website/
  index.html           # Landing page
  policy.html          # Privacy policy
  terms.html           # Terms of use
```

## 🎨 Design System

Refer to `../DESIGN_SYSTEM.md` for complete style guide including:
- Color palette (light/dark themes)
- Spacing and layout standards
- Typography system
- Component styles
- Animation patterns
- Accessibility guidelines

## 🌐 Website Template

The `Website/` folder contains ready-to-use HTML templates:

### Customization Steps:
1. **Update app name** in all three HTML files
2. **Add your app icon** as `icon.png` in the Website folder
3. **Update contact information** in policy.html and terms.html
4. **Update effective dates** for legal documents
5. **Modify pricing** if different from €4.99
6. **Add App Store/Play Store links** when available
7. **Host on GitHub Pages, Netlify, or Vercel**

The website includes:
- Responsive design for mobile and desktop
- Clean, professional styling
- App Store badge ready
- SEO-friendly structure

## 🎨 App Customization

### 1. Update Colors
Edit `constants/colors.ts` to change your brand colors:
```typescript
export const lightTheme = {
  primary: '#YOUR_PRIMARY_COLOR',
  secondary: '#YOUR_SECONDARY_COLOR',
  // ...
};
```

### 2. Add New Screens
Create new files in the `app/` folder:
```typescript
// app/about.tsx
import { useTheme } from '@/contexts/ThemeContext';
import { View, Text, StyleSheet } from 'react-native';

export default function AboutScreen() {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>About Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  text: { fontSize: 18 },
});
```

### 3. Add New Components
Create reusable components in `components/`:
```typescript
// components/CustomButton.tsx
import { useTheme } from '@/contexts/ThemeContext';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
}

export default function CustomButton({ title, onPress }: CustomButtonProps) {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: theme.primary }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: theme.buttonText }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
});
```

## 📱 Features Included

### Theme System
- Light and dark mode support
- Persistent theme preference
- Easy color customization
- Automatic color switching

### Navigation
- File-based routing with Expo Router
- Tab navigation template
- Stack navigation support

### Storage
- AsyncStorage utilities
- Type-safe storage functions
- Easy data persistence

### UI Components
- Custom alert dialog
- Settings modal
- Themed components
- Reusable patterns

### Website
- Landing page with app showcase
- Privacy policy template
- Terms of use template
- Responsive design

## 🛠️ Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Start on iOS simulator
- `npm run android` - Start on Android emulator
- `npm run web` - Start web version
- `npm run lint` - Run ESLint

## 📚 Dependencies

Core dependencies included:
- Expo SDK ~54.0
- React 19.1.0
- React Native 0.81.5
- Expo Router ~6.0
- AsyncStorage
- TypeScript

See `package.json` for complete list.

## 🎯 Next Steps

1. Remove this README or update it for your app
2. Update app.json with your app details (bundle ID, app name, etc.)
3. Customize colors in constants/colors.ts
4. Update Website folder with your app information
5. Add your app icon (1024x1024px) to assets/ and Website/
6. Add your app-specific screens and logic
7. Update legal documents with your information
8. Refer to DESIGN_SYSTEM.md for style guidelines
9. Deploy website to hosting service
10. Submit app to App Store/Play Store

## 📖 Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native](https://reactnative.dev/)
- [Design System Guide](../DESIGN_SYSTEM.md)

## 🌐 Deploying Your Website

### GitHub Pages
1. Push Website folder to GitHub
2. Enable GitHub Pages in repository settings
3. Select branch and /Website folder

### Netlify
1. Connect repository
2. Set build folder to `Website`
3. Deploy

### Vercel
1. Import repository
2. Set output directory to `Website`
3. Deploy

Happy coding! 🚀
