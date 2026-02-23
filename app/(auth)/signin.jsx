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
import ComponentButton from "../../components/ComponentButton";
import Colors from "../../constants/colors";
import ComponentInput from "../../components/ComponentInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { signIn, getLoggedInUser } from "../../lib/appwrite";
import { UserContext } from "../../context/UserContext";

export default () => {
  const { handleSaveUser } = React.useContext(UserContext);
  const [input, setInput] = React.useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const { email, password } = input;

  const handleSignin = async () => {
    if (!email || !password) {
      Alert.alert("Sign In", "Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      await signIn({ email, password });
      const loggedUser = await getLoggedInUser();
      handleSaveUser(loggedUser);
      router.replace("/home");
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-100">
      {/* Decorative background orbs */}
      <View className="absolute top-[-90px] right-[-70px] w-[260px] h-[260px] rounded-full bg-secondary-100" />
      <View className="absolute bottom-[80px] left-[-90px] w-[220px] h-[220px] rounded-full bg-secondary-50" />

      {/* Back button */}
      <TouchableOpacity
        onPress={() => router.back()}
        activeOpacity={0.7}
        className="absolute top-14 left-5 z-10 w-9 h-9 rounded-full bg-secondary-100 border border-primary-300 items-center justify-center"
      >
        <Ionicons name="arrow-back" size={18} color={Colors.secondary.DEFAULT} />
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
              <View className="w-[76px] h-[76px] rounded-full bg-secondary-200 border-[1.5px] border-secondary-400 items-center justify-center mb-3">
                <Ionicons name="camera" size={34} color={Colors.secondary.DEFAULT} />
              </View>
              <Text className="text-white text-[15px] font-bold tracking-[4px]">INSTACLONE</Text>
            </View>

            {/* Heading */}
            <Text className="text-3xl font-bold text-white mb-1">
              Welcome back
            </Text>
            <Text className="text-secondary text-sm mb-8">
              Sign in to your account to continue
            </Text>

            {/* Inputs */}
            <ComponentInput
              placeholder="Email address"
              onChangeText={(v) => setInput((s) => ({ ...s, email: v }))}
              textContentType="emailAddress"
              keyboardType="email-address"
              leftIcon="mail-outline"
            />
            <View className="mt-4">
              <ComponentInput
                placeholder="Password"
                onChangeText={(v) => setInput((s) => ({ ...s, password: v }))}
                secureTextEntry={!showPassword}
                textContentType="password"
                leftIcon="lock-closed-outline"
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword((v) => !v)}
              />
            </View>

            {/* Button */}
            <ComponentButton
              title="Log In"
              onPress={handleSignin}
              buttonStyles="mt-8"
              isLoading={isLoading}
            />

            {/* Divider */}
            <View className="flex-row items-center mt-6 mb-2 gap-[10px]">
              <View className="flex-1 h-px bg-primary-300" />
              <Text className="text-muted text-[13px]">or</Text>
              <View className="flex-1 h-px bg-primary-300" />
            </View>

            {/* Sign up link */}
            <View className="justify-center flex-row gap-2 mt-2">
              <Text className="text-base text-muted-300">
                Don't have an account?
              </Text>
              <Link
                href="/signup"
                className="text-base text-secondary font-semibold"
              >
                Sign Up
              </Link>
            </View>
          </View>

          {/* Footer */}
          <View className="justify-center flex-row pb-8 pt-4">
            <Text className="text-xs text-muted">© 2026 Instaclone</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
