import React from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <StatusBar backgroundColor="#161622" style="light" />
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View>
          <Text className="text-3xl text-white">
            INSTACLONE 🎯
          </Text>
          <Pressable onPress={() => router.push("/home")}>
            <Text className="text-3xl text-highlight">
              Click me to go to home page
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
