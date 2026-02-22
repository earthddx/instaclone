import "../global.css";
import { Stack } from "expo-router/stack";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import UserProvider from "../context/UserProvider";
import { ToastProvider } from "../context/ToastContext";
import Toast from "../components/Toast";
import ErrorBoundary from "../components/ErrorBoundary";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <ToastProvider>
          <ErrorBoundary>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="user" options={{ headerShown: false }} />
              <Stack.Screen name="post" options={{ headerShown: false }} />
            </Stack>
            <Toast />
          </ErrorBoundary>
        </ToastProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
