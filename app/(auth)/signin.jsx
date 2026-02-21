import { Link, router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ComponentButton from "../../components/ComponentButton";
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
    <SafeAreaView style={styles.safeArea}>
      {/* Decorative background orbs */}
      <View style={styles.orbTopRight} />
      <View style={styles.orbBottomLeft} />

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
              <View style={styles.logoRing}>
                <Ionicons name="camera" size={34} color="#4DA6FF" />
              </View>
              <Text style={styles.appName}>INSTACLONE</Text>
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
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign up link */}
            <View className="justify-center flex-row gap-2 mt-2">
              <Text className="text-base text-gray-400">
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
            <Text className="text-xs text-gray-600">© 2026 Instaclone</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0C1929",
  },
  orbTopRight: {
    position: "absolute",
    top: -90,
    right: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(77, 166, 255, 0.08)",
  },
  orbBottomLeft: {
    position: "absolute",
    bottom: 80,
    left: -90,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(26, 110, 235, 0.07)",
  },
  logoRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(77, 166, 255, 0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(77, 166, 255, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  appName: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 4,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 8,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#1A3060",
  },
  dividerText: {
    color: "#4A6080",
    fontSize: 13,
  },
});
