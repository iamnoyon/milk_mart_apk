import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  Stack,
  Redirect,
  useSegments,
} from "expo-router";
import Toast from "react-native-toast-message";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme, ActivityIndicator, View } from "react-native";

import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { store } from "@/store";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AuthProvider, useAuth } from "@/components/Auth/AuthProvider";

SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();

  const currentRoute = segments[0] as string | undefined;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const isRootRoute = !currentRoute || currentRoute === "index";

  if (isAuthenticated && isRootRoute) {
    return <Redirect href="/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="home" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="otp-verify" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <AuthProvider>
            <AnimatedSplashOverlay />
            <AppNavigator />
          </AuthProvider>
          <Toast />
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
