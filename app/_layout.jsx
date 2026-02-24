import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router/stack";
import { useRouter } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import UserProvider from "../context/UserProvider";
import { ToastProvider } from "../context/ToastContext";
import Toast from "../components/Toast";
import ErrorBoundary from "../components/ErrorBoundary";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import {
  useLocalNotifications,
  setupAndroidChannel,
  requestNotificationPermission,
} from "../hooks/useLocalNotifications";
import { useRealtimeNotifications } from "../hooks/useRealtimeNotifications";

function NotificationSetup() {
  const router = useRouter();
  const { user } = useContext(UserContext);

  useEffect(() => {
    setupAndroidChannel();
    requestNotificationPermission();
  }, []);

  useLocalNotifications({
    // Fires when a notification arrives while the app is open
    onReceived: (notification) => {
      console.log("[Notification received]", notification.request.content.title);
    },
    // Fires when the user taps a notification — use data.route to deep-link
    onResponse: (response) => {
      const route = response.notification.request.content.data?.route;
      if (route) router.push(route);
    },
  });

  // Subscribes to Appwrite Realtime for likes, comments, follows
  useRealtimeNotifications(user);

  return null;
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <ToastProvider>
          <ErrorBoundary>
            <NotificationSetup />
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="about" options={{ headerShown: false }} />
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
