import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// ─── Global foreground handler ────────────────────────────────────────────────
// Must be called at module level (outside any component) so it's registered
// as soon as this file is imported.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ─── Android notification channel ────────────────────────────────────────────
// Android requires at least one channel before you can show any notification.
// Call this once at app startup.
export async function setupAndroidChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("default", {
    name: "Default",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#4DA6FF", // secondary brand color
  });
}

// ─── Permission ───────────────────────────────────────────────────────────────
// Returns true if permission is granted (or was just granted).
export async function requestNotificationPermission() {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

// ─── Schedule a local notification ───────────────────────────────────────────
// seconds = 1 → show as soon as possible (minimum interval is 1s)
// seconds > 1 → delay by that many seconds
export async function scheduleLocalNotification({ title, body, data = {}, seconds = 1 }) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.max(1, seconds),
    },
  });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
// onReceived(notification)         — fires when a notification arrives while app is open
// onResponse(response)             — fires when the user taps a notification
//
// Usage:
//   useLocalNotifications({
//     onReceived: (n) => console.log("Got notification:", n.request.content.title),
//     onResponse: (r) => router.push(r.notification.request.content.data.route),
//   });
export function useLocalNotifications({ onReceived, onResponse } = {}) {
  const receivedRef = useRef();
  const responseRef = useRef();

  useEffect(() => {
    if (onReceived) {
      receivedRef.current = Notifications.addNotificationReceivedListener(onReceived);
    }
    if (onResponse) {
      responseRef.current = Notifications.addNotificationResponseReceivedListener(onResponse);
    }

    return () => {
      receivedRef.current?.remove();
      responseRef.current?.remove();
    };
  }, []);

  return { scheduleLocalNotification, requestNotificationPermission };
}
