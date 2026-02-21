import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, Pressable } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../context/UserContext";
import ComponentButton from "../components/ComponentButton";

export default function App() {
  const { user } = React.useContext(UserContext);

  if (user) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="flex-1 bg-primary-100">
      <StatusBar backgroundColor="#0C1929" style="light" />

      {/* Decorative orbs */}
      <View className="absolute top-[-100px] right-[-70px] w-[290px] h-[290px] rounded-[145px] bg-[rgba(77,166,255,0.07)]" />
      <View className="absolute bottom-[-70px] left-[-90px] w-[250px] h-[250px] rounded-[125px] bg-[rgba(26,110,235,0.07)]" />
      <View className="absolute top-[30%] self-center w-[220px] h-[220px] rounded-[110px] bg-[rgba(77,166,255,0.04)]" />

      <View className="flex-1 px-7 justify-center gap-10">
        {/* Hero */}
        <View className="items-center">
          <View className="w-[100px] h-[100px] rounded-full bg-[rgba(77,166,255,0.12)] border-[1.5px] border-[rgba(77,166,255,0.35)] items-center justify-center mb-[22px]">
            <Ionicons name="camera" size={46} color="#4DA6FF" />
          </View>
          <Text className="text-white text-[30px] font-extrabold tracking-[7px] mb-[10px]">INSTACLONE</Text>
          <Text className="text-secondary text-[15px] tracking-[0.4px]">Share your world</Text>
        </View>

        {/* Feature pills */}
        <View className="flex-row justify-center items-center gap-[10px]">
          <View className="flex-row items-center gap-[5px] py-[7px] px-[13px] bg-[rgba(77,166,255,0.08)] rounded-[20px] border border-[rgba(77,166,255,0.15)]">
            <Ionicons name="image-outline" size={15} color="#4DA6FF" />
            <Text className="text-secondary text-xs font-medium">Photos</Text>
          </View>
          <View className="w-[3px] h-[3px] rounded-[2px] bg-primary-300" />
          <View className="flex-row items-center gap-[5px] py-[7px] px-[13px] bg-[rgba(77,166,255,0.08)] rounded-[20px] border border-[rgba(77,166,255,0.15)]">
            <Ionicons name="videocam-outline" size={15} color="#4DA6FF" />
            <Text className="text-secondary text-xs font-medium">Videos</Text>
          </View>
          <View className="w-[3px] h-[3px] rounded-[2px] bg-primary-300" />
          <View className="flex-row items-center gap-[5px] py-[7px] px-[13px] bg-[rgba(77,166,255,0.08)] rounded-[20px] border border-[rgba(77,166,255,0.15)]">
            <Ionicons name="people-outline" size={15} color="#4DA6FF" />
            <Text className="text-secondary text-xs font-medium">Connect</Text>
          </View>
        </View>

        {/* CTA buttons */}
        <View className="gap-3">
          <ComponentButton
            title="Sign In"
            onPress={() => router.push("/signin")}
            buttonStyles="w-full"
          />
          <Pressable
            className="border-[1.5px] border-highlight rounded-2xl min-h-[54px] justify-center items-center"
            style={({ pressed }) => pressed && { opacity: 0.65 }}
            onPress={() => router.push("/signup")}
          >
            <Text className="text-secondary text-[15px] font-semibold tracking-[0.3px]">Create an account</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <Text className="text-[#2A4060] text-[11px] text-center">© 2026 Instaclone</Text>
      </View>
    </SafeAreaView>
  );
}
