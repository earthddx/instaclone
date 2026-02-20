import React from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View, Pressable } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "../context/UserContext";
import { getLoggedInUser } from "../lib/appwrite";
import ComponentButton from "../components/ComponentButton";

export default function App() {
  const { user } = React.useContext(UserContext);

  if (user) {
    return <Redirect href={"/home"} />;
  }
 
  return (
    <SafeAreaView className="bg-primary-100 h-full">
      <StatusBar backgroundColor="#0C1929" style="light" />
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="h-full justify-center items-center px-8">
          <Text className="text-5xl font-bold text-white mb-2">Instaclone</Text>
          <Text className="text-secondary text-base mb-16">Share your world</Text>
          <ComponentButton
            title="Sign In"
            onPress={() => router.push("/signin")}
            buttonStyles="w-full"
          />
          <View className="flex-row mt-5 items-center gap-1">
            <Text className="text-gray-400 text-base">New here?</Text>
            <Pressable onPress={() => router.push("/signup")}>
              <Text className="text-secondary text-base"> Create an account</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
