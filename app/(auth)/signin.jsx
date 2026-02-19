import { Link, router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  InputAccessoryView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import ComponentButton from "../../components/ComponentButton";
import ComponentInput from "../../components/ComponentInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { signIn, getLoggedInUser } from "../../lib/appwrite";
import { UserContext } from "../../context/UserContext";

export default (props) => {
  const { handleSaveUser } = React.useContext(UserContext);
  const [input, setInput] = React.useState({ email: "", password: "" });
  const { email, password } = input;

  const handleSignin = async (props) => {
    if (!email || !password) {
      Alert.alert("[Sign-in attempt]: ", "Please fill in all of the fields");
    }
    try {
      await signIn({ email, password });
      //TODO: create session rather?
      const loggedUser = getLoggedInUser();
      handleSaveUser(loggedUser);
      router.replace("/home");
    } catch (e) {
      Alert.alert("Error", e.message);
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
            <Text className="text-4xl font-bold text-white mb-2">Welcome back</Text>
            <Text className="text-secondary text-base mb-10">Sign in to continue</Text>
            <ComponentInput
              placeholder={"Email"}
              onChangeText={(ev) => setInput((state) => ({ ...state, email: ev }))}
              textContentType={"emailAddress"}
            />
            <View className="mt-4">
              <ComponentInput
                placeholder={"Password"}
                onChangeText={(ev) => setInput((state) => ({ ...state, password: ev }))}
                secureTextEntry
                textContentType={"password"}
              />
            </View>
            <ComponentButton
              title={"Log In"}
              onPress={handleSignin}
              buttonStyles={"mt-8"}
            />
            <View className="justify-center pt-6 flex-row gap-2">
              <Text className="text-base text-gray-400">
                Don't have an account?
              </Text>
              <Link href="/signup" className="text-base text-secondary">
                Sign Up
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
