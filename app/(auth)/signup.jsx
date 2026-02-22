import { Link, router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ComponentButton from "../../components/ComponentButton";
import ComponentInput from "../../components/ComponentInput";
import { signUp } from "../../lib/appwrite";

export default () => {
  const [state, setState] = React.useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const { email, password, username } = state;

  const onSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert("Sign Up", "Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      await signUp({ email, password, username });
      router.replace("/home");
    } catch (e) {
      Alert.alert("Sign Up Error", e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-100">
      {/* Decorative background orbs */}
      <View className="absolute top-[-70px] left-[-80px] w-[240px] h-[240px] rounded-full bg-[rgba(26,110,235,0.08)]" />
      <View className="absolute bottom-[60px] right-[-80px] w-[210px] h-[210px] rounded-full bg-[rgba(77,166,255,0.07)]" />

      {/* Back button */}
      <TouchableOpacity
        onPress={() => router.back()}
        activeOpacity={0.7}
        className="absolute top-14 left-5 z-10 w-9 h-9 rounded-full bg-[rgba(77,166,255,0.08)] border border-primary-300 items-center justify-center"
      >
        <Ionicons name="arrow-back" size={18} color="#4DA6FF" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 justify-center">
            {/* Logo */}
            <View className="items-center mb-10">
              <View className="w-[76px] h-[76px] rounded-full bg-[rgba(77,166,255,0.12)] border-[1.5px] border-[rgba(77,166,255,0.35)] items-center justify-center mb-3">
                <Ionicons name="camera" size={34} color="#4DA6FF" />
              </View>
              <Text className="text-white text-[15px] font-bold tracking-[4px]">INSTACLONE</Text>
            </View>

            {/* Heading */}
            <Text className="text-3xl font-bold text-white mb-1">
              Create account
            </Text>
            <Text className="text-secondary text-sm mb-8">
              Join Instaclone and start sharing
            </Text>

            {/* Inputs */}
            <ComponentInput
              placeholder="Username"
              onChangeText={(v) => setState((s) => ({ ...s, username: v }))}
              textContentType="username"
              leftIcon="person-outline"
            />
            <View className="mt-4">
              <ComponentInput
                placeholder="Email address"
                onChangeText={(v) => setState((s) => ({ ...s, email: v }))}
                textContentType="emailAddress"
                keyboardType="email-address"
                leftIcon="mail-outline"
              />
            </View>
            <View className="mt-4">
              <ComponentInput
                placeholder="Password"
                onChangeText={(v) => setState((s) => ({ ...s, password: v }))}
                secureTextEntry={!showPassword}
                textContentType="newPassword"
                leftIcon="lock-closed-outline"
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword((v) => !v)}
              />
            </View>

            {/* Password hint */}
            <Text className="text-[#4A6080] text-xs mt-[6px] ml-1">
              Use 8+ characters with letters and numbers
            </Text>

            {/* Button */}
            <ComponentButton
              title="Create Account"
              onPress={onSignUp}
              buttonStyles="mt-6"
              isLoading={isLoading}
            />

            {/* Divider */}
            <View className="flex-row items-center mt-6 mb-2 gap-[10px]">
              <View className="flex-1 h-px bg-primary-300" />
              <Text className="text-[#4A6080] text-[13px]">or</Text>
              <View className="flex-1 h-px bg-primary-300" />
            </View>

            {/* Sign in link */}
            <View className="justify-center flex-row gap-2 mt-2">
              <Text className="text-base text-gray-400">
                Already have an account?
              </Text>
              <Link
                href="/signin"
                className="text-base text-secondary font-semibold"
              >
                Log In
              </Link>
            </View>
          </View>

          {/* Footer */}
          <View className="justify-center flex-row pb-8 pt-4">
            <Text className="text-xs text-gray-600">© 2026 Instaclone</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
