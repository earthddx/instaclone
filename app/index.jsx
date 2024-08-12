import React from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View,Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View>
          <Text>Main page before login/signup.</Text>
          <Pressable onPress={() => router.push("/home")}>
            <Text> Click me to go to home page</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
