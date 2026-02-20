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
    <SafeAreaView style={styles.safeArea}>
      {/* Decorative background orbs */}
      <View style={styles.orbTopLeft} />
      <View style={styles.orbBottomRight} />

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
            <Text style={styles.hint}>
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
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0C1929",
  },
  orbTopLeft: {
    position: "absolute",
    top: -70,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(26, 110, 235, 0.08)",
  },
  orbBottomRight: {
    position: "absolute",
    bottom: 60,
    right: -80,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "rgba(77, 166, 255, 0.07)",
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
  hint: {
    color: "#4A6080",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
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
