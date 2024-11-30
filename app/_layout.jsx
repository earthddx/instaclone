import { Stack } from "expo-router/stack";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import UserProvider from "../context/UserProvider";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <UserProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
    </GestureHandlerRootView>
  );
}
