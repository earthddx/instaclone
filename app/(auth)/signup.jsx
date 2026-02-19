import { Link, router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import ComponentButton from "../../components/ComponentButton";
import ComponentInput from "../../components/ComponentInput";
import { signUp } from "../../lib/appwrite";

export default (props) => {
  const [state, setState] = React.useState({
    username: "",
    email: "",
    password: "",
  });
  const { email, password, username } = state;

  const onSignUp = async () => {
    try {
      const newUser = await signUp({
        email: email,
        password: password,
        username: username,
      });
      //save user to global state
      router.replace("/home");
    } catch (e) {
      Alert.alert("[signup]: ", e.message);
    }
  };

  return (
    <SafeAreaView className="bg-primary-100 h-full flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 justify-center">
            <Text className="text-4xl font-bold text-white mb-2">Create account</Text>
            <Text className="text-secondary text-base mb-10">Join Instaclone today</Text>
            <ComponentInput
              placeholder={"Username"}
              onChangeText={(ev) => setState((prev) => ({ ...prev, username: ev }))}
              textContentType={"username"}
            />
            <View className="mt-4">
              <ComponentInput
                placeholder={"Email"}
                onChangeText={(ev) => setState((prev) => ({ ...prev, email: ev }))}
                textContentType={"emailAddress"}
              />
            </View>
            <View className="mt-4">
              <ComponentInput
                placeholder={"Password"}
                onChangeText={(ev) => setState((prev) => ({ ...prev, password: ev }))}
                textContentType={"newPassword"}
              />
            </View>
            <ComponentButton
              title={"Sign Up"}
              onPress={onSignUp}
              buttonStyles={"mt-8"}
            />
            <View className="justify-center pt-6 flex-row gap-2">
              <Text className="text-base text-gray-400">Already have an account?</Text>
              <Link href="/signin" className="text-base text-secondary">
                Log in
              </Link>
            </View>
          </View>
          <View className="justify-center flex-row pb-8">
            <Text className="text-xs text-gray-600">
              2026 Instaclone · React Native
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
