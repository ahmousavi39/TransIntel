import { ThemeProvider } from '@/contexts/ThemeContext';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import 'react-native-reanimated';

export default function RootLayout() {
  useEffect(() => {
    // Initialize any app-wide setup here
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
