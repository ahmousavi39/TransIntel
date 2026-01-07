# Design System & Style Guide

## 📱 App Overview
**Knowly Quiz App** - A React Native/Expo quiz application with theme support (light/dark mode), featuring a clean, modern UI with smooth animations and intuitive user experience.

---

## 🎨 Color Palette

### Primary Theme Colors
- **Primary Purple**: `#b93ec7` - Main brand color, used for primary buttons and highlights
- **Primary Dark Purple**: `#9a2fb0` - Darker variant for pressed states
- **Secondary Blue**: `#42b1ed` - Accent color for secondary actions
- **Success Green**: 
  - Light mode: `#34C759`
  - Dark mode: `#30D158`
- **Error Red**:
  - Light mode: `#FF3B30`
  - Dark mode: `#FF453A`

### Light Theme (`lightTheme`)
```typescript
{
  background: '#FFFFFF',        // Main background
  card: '#FFFFFF',             // Card backgrounds
  pointsCard: '#F5F5F5',       // Points display card (slightly off-white)
  text: '#000000',             // Primary text
  textSecondary: '#666666',    // Secondary/muted text
  primary: '#b93ec7',          // Primary actions
  secondary: '#42b1ed',        // Secondary actions
  primaryDark: '#9a2fb0',      // Primary hover/pressed
  success: '#34C759',          // Success states
  error: '#FF3B30',            // Error states
  border: '#CCCCCC',           // Borders and dividers
  shadow: '#000000',           // Shadow color
  buttonText: '#FFFFFF',       // Text on colored buttons
  inputBackground: '#FFFFFF',  // Input field backgrounds
  placeholder: '#999999',      // Placeholder text
}
```

### Dark Theme (`darkTheme`)
```typescript
{
  background: '#000000',        // Main background (pure black)
  card: '#1C1C1E',             // Card backgrounds (dark gray)
  pointsCard: '#1C1C1E',       // Points display card
  text: '#FFFFFF',             // Primary text
  textSecondary: '#A0A0A0',    // Secondary/muted text
  primary: '#b93ec7',          // Primary actions (same as light)
  secondary: '#42b1ed',        // Secondary actions (same as light)
  primaryDark: '#9a2fb0',      // Primary hover/pressed
  success: '#30D158',          // Success states
  error: '#FF453A',            // Error states
  border: '#38383A',           // Borders and dividers
  shadow: '#FFFFFF',           // Shadow color
  buttonText: '#FFFFFF',       // Text on colored buttons
  inputBackground: '#2C2C2E',  // Input field backgrounds
  placeholder: '#888888',      // Placeholder text
}
```

### Tab/Icon Colors (Legacy - for reference)
- **Light Mode Tint**: `#0a7ea4`
- **Dark Mode Tint**: `#ffffff`
- **Light Icon Default**: `#687076`
- **Dark Icon Default**: `#9BA1A6`

---

## 📐 Spacing & Layout

### Padding Standards
- **Screen Padding Horizontal**: `20px` (standard left/right padding for content)
- **Header Padding Top**: `60px` (to account for status bar)
- **Header Padding Bottom**: `20px`
- **Content Padding Top**: `20px`
- **Card Padding**: `20px` for info containers
- **Modal Content Padding**: `24px` horizontal, `32px` vertical
- **Alert Content Padding**: `24px`

### Margins
- **Large Section Margins**: `40px` (between major sections)
- **Medium Margins**: `30px` (between related groups)
- **Standard Margins**: `16px` (between buttons or elements)
- **Small Margins**: `12px` (between labels and inputs)
- **Tiny Margins**: `10px` (between info items)

### Component Sizing
- **Button Height**: `16px` paddingVertical (total ~48-52px with text)
- **Button Radius**: `12px` (rounded corners)
- **Icon Button Size**: `50x50px` (square)
- **Icon Button Radius**: `25px` (circular)
- **Input Min Height**: `50px`
- **Modal Max Width**: `90%` of screen
- **Alert Max Width**: `340px`

---

## 🔤 Typography

### Font System
- **Sans**: System default fonts (`system-ui`, `-apple-system`, etc.)
- **iOS Rounded**: `ui-rounded` for a softer look (optional)
- **Monospace**: For code or technical text

### Font Sizes
- **Extra Large Title**: `32px` (quiz results, major headings)
- **Title**: `28px` (screen titles)
- **Large Heading**: `24px` (section headings)
- **Heading**: `20px` (card titles, question headers)
- **Body Large**: `18px` (buttons, labels, important text)
- **Body**: `16px` (standard content, quiz questions)
- **Body Small**: `14px` (info text, hints, descriptions)
- **Caption**: `12px` (metadata, footnotes)

### Font Weights
- **Bold**: `'bold'` or `700` - Titles, emphasis
- **Semi-Bold**: `'600'` - Buttons, labels, sub-headings
- **Medium**: `'500'` - Regular emphasis (optional)
- **Regular**: `'normal'` or `400` - Body text

### Line Heights
- **Comfortable Reading**: `20px` for 14px font
- **Standard**: `1.5` relative line height for most text
- **Tight**: `1.2` for headings

---

## 🎭 Component Styles

### Buttons

#### Primary Button
```typescript
{
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: 'center',
  backgroundColor: theme.primary,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,  // Android shadow
}
// Text: fontSize: 18, fontWeight: '600', color: theme.buttonText
```

#### Secondary/Cancel Button
```typescript
{
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: 'center',
  backgroundColor: theme.card,
  borderWidth: 2,
  borderColor: theme.border,
}
// Text: fontSize: 18, fontWeight: '600', color: theme.text
```

#### Destructive Button
```typescript
{
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: 'center',
  backgroundColor: theme.error,
}
// Text: fontSize: 18, fontWeight: 'bold', color: theme.buttonText
```

#### Icon Button (Settings/Circular)
```typescript
{
  width: 50,
  height: 50,
  borderRadius: 25,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.card,
}
```

### Cards
```typescript
{
  backgroundColor: theme.card,
  borderRadius: 16,          // More rounded than buttons
  padding: 20,
  shadowColor: theme.shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 4,
}
```

### Input Fields
```typescript
{
  backgroundColor: theme.inputBackground,
  borderWidth: 2,
  borderColor: theme.border,
  borderRadius: 12,
  padding: 16,
  fontSize: 16,
  color: theme.text,
  minHeight: 50,
}

// Focus state: borderColor: theme.primary
// Error state: borderColor: theme.error
```

### Picker/Dropdown
```typescript
{
  backgroundColor: theme.card,
  borderWidth: 1,
  borderColor: theme.border,
  borderRadius: 12,
  overflow: 'hidden',
  minHeight: 50,
}
```

### Modals

#### Full Modal Container
```typescript
{
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent overlay
}
```

#### Modal Content
```typescript
{
  backgroundColor: theme.card,
  borderRadius: 20,
  padding: 24,
  maxWidth: '90%',
  shadowColor: theme.shadow,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 10,
  elevation: 10,
}
```

#### Alert Dialog
```typescript
{
  backgroundColor: theme.card,
  borderRadius: 16,
  padding: 24,
  maxWidth: 340,
  width: '90%',
}
```

### Answer Options (Quiz)
```typescript
// Default state
{
  padding: 16,
  borderRadius: 12,
  backgroundColor: theme.card,
  borderWidth: 2,
  borderColor: theme.border,
  marginBottom: 12,
}

// Selected state
{
  borderColor: theme.primary,
  backgroundColor: theme.primary + '10',  // 10% opacity
}

// Correct answer (after submission)
{
  borderColor: theme.success,
  backgroundColor: theme.success + '20',  // 20% opacity
}

// Incorrect answer (after submission)
{
  borderColor: theme.error,
  backgroundColor: theme.error + '20',
}
```

---

## 🎬 Animations

### Spring Animations
Used for interactive elements like points, selections
```typescript
Animated.spring(animValue, {
  toValue: 1.3,
  useNativeDriver: true,
  speed: 20,
  tension: 50,
  friction: 8,
})
```

### Fade Animations
Used for modals, transitions
```typescript
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 200,
  useNativeDriver: true,
})
```

### Scale Animations
Used for button presses, emphasis
```typescript
// Scale up
Animated.spring(scaleAnim, {
  toValue: 1.3,
  useNativeDriver: true,
  speed: 20,
})

// Scale back
Animated.spring(scaleAnim, {
  toValue: 1,
  useNativeDriver: true,
  speed: 20,
})
```

### Slide Animations (Modal entrance)
```typescript
transform: [{
  translateY: fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],  // Slide up from bottom
  })
}]
```

### Animation Timing
- **Fast**: 200ms (fades, quick transitions)
- **Medium**: 500ms (modal fades, delays)
- **Slow**: 1500ms (success indicators, point changes)

---

## 🎯 Icons

### Icon Library
**@expo/vector-icons (Ionicons)**

### Common Icons
- **Settings**: ⚙️ or `<Ionicons name="settings" />`
- **Success**: `<Ionicons name="checkmark-circle" color={theme.success} />`
- **Error**: `<Ionicons name="close-circle" color={theme.error} />`
- **Warning**: `<Ionicons name="warning" color={theme.error} />`
- **Info**: `<Ionicons name="information-circle" color={theme.primary} />`
- **Close**: `<Ionicons name="close" />`
- **Home**: `<Ionicons name="home" />`
- **Menu**: `<Ionicons name="menu" />`

### Icon Sizes
- **Extra Large**: `48px` (alert/modal icons)
- **Large**: `32px` (feature icons)
- **Medium**: `24px` (standard icons, emoji replacements)
- **Small**: `20px` (inline icons)

---

## 📱 Layout Patterns

### Screen Structure
```
┌─────────────────────────────┐
│  Header (paddingTop: 60)    │  ← Status bar safe area
│  - Title + Settings button  │
├─────────────────────────────┤
│                             │
│  Content Area               │  ← Main scrollable content
│  (paddingHorizontal: 20)    │     flex: 1
│                             │
│                             │
│                             │
└─────────────────────────────┘
```

### Header Pattern
```typescript
<View style={styles.header}>
  <Text style={styles.title}>Screen Title</Text>
  <TouchableOpacity style={styles.settingsButton}>
    <Icon />
  </TouchableOpacity>
</View>

// Styles
{
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: 60,
  paddingHorizontal: 20,
  paddingBottom: 20,
}
```

### Content Container
```typescript
<View style={styles.content}>
  {/* Main content */}
</View>

// Styles
{
  flex: 1,
  paddingHorizontal: 20,
  paddingTop: 20,
}
```

---

## 🎨 Theme Implementation

### Theme Context Usage
```typescript
import { useTheme } from '@/contexts/ThemeContext';

const { theme, isDark, toggleTheme } = useTheme();

// Apply dynamic colors
<View style={{ backgroundColor: theme.background }}>
  <Text style={{ color: theme.text }}>Content</Text>
</View>
```

### Theme Switching
- Theme preference is stored in AsyncStorage
- Key: `@theme_preference`
- Values: `'dark'` or `'light'`
- Persists across app restarts
- Toggle function available via `useTheme()` hook

### Always Use Dynamic Colors
❌ **DON'T**: Hardcode colors
```typescript
<Text style={{ color: '#000000' }}>Text</Text>
```

✅ **DO**: Use theme colors
```typescript
<Text style={{ color: theme.text }}>Text</Text>
```

---

## 🔄 State Management

### Local Storage (AsyncStorage)
Used for:
- Theme preference (`@theme_preference`)
- User points and level
- Question progress
- Answered questions tracking

### Component State
- Use `useState` for UI state (modals, selections, inputs)
- Use `useEffect` for side effects (loading data, animations)
- Use `useRef` for animation values and persistent data

---

## ⚡ Performance Guidelines

### Optimize Renders
- Use `React.memo` for expensive components
- Avoid inline functions in render
- Use `useCallback` for callbacks passed to children

### Images & Assets
- Store images in `assets/` folder
- Use `expo-image` for optimized image loading

### Animations
- Always use `useNativeDriver: true` when possible
- Avoid animating layout properties (width, height)
- Prefer transform and opacity animations

---

## 📝 Code Style Guidelines

### File Naming
- Components: PascalCase (e.g., `CustomAlert.tsx`)
- Utilities: camelCase (e.g., `storage.ts`)
- Screens: PascalCase or kebab-case (e.g., `index.tsx`, `quiz.tsx`)
- Types: camelCase (e.g., `quiz.ts`)

### Import Order
1. React & React Native core
2. Third-party libraries
3. Expo modules
4. Local components (with @/ alias)
5. Local utilities
6. Types
7. Styles

### Component Structure
```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

// 2. Types/Interfaces
interface ComponentProps {
  // ...
}

// 3. Component
export default function Component({ props }: ComponentProps) {
  // 4. Hooks
  const { theme } = useTheme();
  const [state, setState] = useState();
  
  // 5. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 6. Handlers
  const handlePress = () => {
    // ...
  };
  
  // 7. Render
  return (
    <View style={styles.container}>
      {/* JSX */}
    </View>
  );
}

// 8. Styles
const styles = StyleSheet.create({
  // ...
});
```

### TypeScript Best Practices
- Always type props and state
- Use interfaces for component props
- Use type aliases for unions and complex types
- Avoid `any` - use `unknown` if type is truly unknown

---

## 🎁 Reusable Components

### CustomAlert
**Purpose**: Cross-platform alert dialog with theming
**Props**:
- `visible`: boolean
- `title`: string
- `message`: string
- `buttons`: AlertButton[]
- `icon`: 'info' | 'error' | 'success' | 'warning'
- `onClose`: () => void

**Usage**:
```typescript
<CustomAlert
  visible={alertVisible}
  title="Success"
  message="Your changes have been saved."
  icon="success"
  buttons={[{ text: 'OK' }]}
  onClose={() => setAlertVisible(false)}
/>
```

### SettingsModal
**Purpose**: Settings screen in modal format
**Features**: Theme toggle, reset functionality, privacy links

### ThemedText / ThemedView
**Purpose**: Components that automatically apply theme colors

---

## 🎮 User Experience Patterns

### Loading States
- Show `<ActivityIndicator>` while loading
- Color: `theme.primary`
- Size: `'large'`

### Empty States
- Center text with secondary color
- Provide clear next action
- Use friendly, helpful language

### Error States
- Use error color (`theme.error`)
- Show error icon
- Provide recovery action (retry button)

### Success Feedback
- Use success color (`theme.success`)
- Show checkmark icon
- Brief confirmation message
- Auto-dismiss after 2-3 seconds (optional)

### Haptic Feedback
Use `expo-haptics` for:
- Button presses: `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)`
- Success: `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)`
- Error: `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)`

---

## 🌐 Platform-Specific Considerations

### iOS
- Use rounded fonts when appropriate
- Respect safe areas (paddingTop: 60 for status bar)
- Use native haptics
- Modal presentations follow iOS conventions

### Android
- Use `elevation` for shadows instead of shadow* props
- Material design ripple effects on touchables
- Hardware back button support

### Web
- Fallback fonts for web (`system-ui`, `sans-serif`)
- Responsive sizing for larger screens
- Hover states for interactive elements

---

## 🔒 Accessibility

### Text Contrast
- Ensure 4.5:1 contrast ratio for normal text
- Ensure 3:1 contrast ratio for large text
- Use `textSecondary` sparingly, ensure readability

### Touch Targets
- Minimum 44x44pt touch target (iOS HIG)
- Adequate spacing between interactive elements

### Semantic Labels
- Use `accessibilityLabel` for icons
- Use `accessibilityHint` for complex interactions
- Use `accessibilityRole` appropriately

---

## 📦 Dependencies & Tech Stack

### Core
- **React Native**: 0.81.5
- **Expo**: ~54.0
- **React**: 19.1.0
- **TypeScript**: ~5.9.2

### Navigation
- **expo-router**: ~6.0 (file-based routing)

### UI Libraries
- **@expo/vector-icons**: Icons (Ionicons)
- **@react-native-picker/picker**: Dropdown picker

### Storage
- **@react-native-async-storage/async-storage**: Persistent storage

### Utilities
- **expo-haptics**: Haptic feedback
- **expo-linking**: Deep linking
- **react-native-reanimated**: Advanced animations (if needed)

---

## 🎯 Design Principles

1. **Consistency**: Use theme colors and spacing consistently
2. **Clarity**: Clear typography hierarchy, readable text sizes
3. **Feedback**: Immediate visual feedback for all interactions
4. **Performance**: Smooth 60fps animations, fast loading
5. **Accessibility**: High contrast, large touch targets, semantic labels
6. **Simplicity**: Clean, uncluttered interfaces
7. **Delight**: Subtle animations, haptic feedback, smooth transitions

---

## 📚 Quick Reference

### Most Used Colors
```typescript
theme.background     // Screen backgrounds
theme.card          // Card/container backgrounds
theme.text          // Primary text
theme.textSecondary // Muted text
theme.primary       // Primary buttons, highlights
theme.border        // Borders, dividers
theme.success       // Success states
theme.error         // Error states, warnings
```

### Most Used Spacing
```typescript
paddingHorizontal: 20   // Screen edges
paddingVertical: 16     // Buttons
borderRadius: 12        // Buttons, inputs
borderRadius: 16        // Cards
marginBottom: 12        // Between related items
gap: 10                 // Flex gap for spacing
```

### Most Used Fonts
```typescript
fontSize: 28, fontWeight: 'bold'     // Titles
fontSize: 18, fontWeight: '600'      // Buttons, labels
fontSize: 16, fontWeight: 'normal'   // Body text
fontSize: 14, color: textSecondary   // Info text
```

---

## 🚀 Implementation Checklist

When creating a new screen or component:
- [ ] Import and use `useTheme()` hook
- [ ] Apply `theme.background` to main container
- [ ] Use dynamic theme colors for all visual elements
- [ ] Add appropriate padding (20px horizontal for screens)
- [ ] Use consistent border radius (12px buttons, 16px cards)
- [ ] Implement loading states
- [ ] Add error handling with appropriate feedback
- [ ] Test in both light and dark modes
- [ ] Ensure proper TypeScript typing
- [ ] Add haptic feedback for interactions
- [ ] Check accessibility (contrast, touch targets)
- [ ] Test on iOS, Android, and Web (if applicable)

---

## 💡 Examples

### Creating a Button
```typescript
<TouchableOpacity
  style={[
    styles.button,
    { backgroundColor: theme.primary }
  ]}
  onPress={handlePress}
>
  <Text style={[styles.buttonText, { color: theme.buttonText }]}>
    Click Me
  </Text>
</TouchableOpacity>

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
```

### Creating a Card
```typescript
<View style={[styles.card, { 
  backgroundColor: theme.card,
  borderColor: theme.border 
}]}>
  <Text style={[styles.cardTitle, { color: theme.text }]}>
    Card Title
  </Text>
  <Text style={[styles.cardBody, { color: theme.textSecondary }]}>
    Card content goes here
  </Text>
</View>

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
  },
});
```

---

## 🎨 Summary for AI Assistants

When generating new apps or components in this style:
1. **Always use the theme system** - Import `useTheme()` and apply colors dynamically
2. **Follow spacing conventions** - 20px horizontal padding, 12-16px border radius, consistent margins
3. **Match typography** - Use established font sizes and weights
4. **Implement dark mode support** - Test all colors work in both themes
5. **Add animations** - Use spring and fade animations for delight
6. **Use TypeScript** - Type all props, state, and functions
7. **Follow component structure** - Imports, types, hooks, handlers, render, styles
8. **Apply consistent patterns** - Headers, cards, buttons, modals should feel familiar
9. **Consider accessibility** - Proper contrast, touch targets, semantic labels
10. **Optimize performance** - Native driver animations, minimal re-renders

This design system ensures a cohesive, professional, and delightful user experience across all screens and interactions.
