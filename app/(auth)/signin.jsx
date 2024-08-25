import { Link } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  InputAccessoryView,
  TextInput,
} from "react-native";
import ComponentButton from "../../components/ComponentButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { signIn } from "../../services/appwrite";

export default (props) => {
  const [input, setInput] = React.useState({ email: "", password: "" });
  const { email, password } = input;

  const handleSignin = async (props) => {
    await signIn({ email, password });
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <Text>Sign in</Text>
      <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
        Instaclone 🎯
      </Text>
      <TextInput
        placeholder={"Email"}
        onChangeText={(ev) => setInput((state) => ({ ...state, email: ev }))}
      />
      <TextInput
        placeholder={"Password"}
        onChangeText={(ev) => setInput((state) => ({ ...state, password: ev }))}
      />
      <ComponentButton title={"Log In"} onPress={handleSignin} className={""} />
      <View className="justify-center pt-5 flex-row gap-2">
        <Text className="text-lg text-gray-100 font-pregular">
          Don't have an account?
        </Text>
        <Link href="/signup" className="text-lg font-psemibold  text-highlight">
          Sign Up
        </Link>
      </View>
    </SafeAreaView>
  );
};
