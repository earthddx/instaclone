import "../global.css";
import { Stack } from "expo-router/stack";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import UserProvider from "../context/UserProvider";
import { ToastProvider } from "../context/ToastContext";
import Toast from "../components/Toast";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <ToastProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <Toast />
        </ToastProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
