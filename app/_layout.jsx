import { Stack } from "expo-router/stack";
import UserProvider from "../context/UserProvider";

export default function Layout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(aux)" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}
