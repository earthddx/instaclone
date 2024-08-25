import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Tab() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
        Sign up
      </Text>
      <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
        Have an account?{" "}
        <Link
          href="/signin"
          className="text-lg font-psemibold text-highlight"
        >
          Log in
        </Link>
      </Text>
    </SafeAreaView>
  );
}
