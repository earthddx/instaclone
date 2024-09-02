import { Link, router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  InputAccessoryView,
  TextInput,
  Alert,
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
    <SafeAreaView className="bg-primary h-full flex-1">
      <Text>Sign in</Text>
      <Text className="text-2xl font-semibold text-white mt-10">
        Instaclone 🎯
      </Text>
      <ComponentInput
        placeholder={"Email"}
        onChangeText={(ev) => setInput((state) => ({ ...state, email: ev }))}
      />
      <ComponentInput
        placeholder={"Password"}
        onChangeText={(ev) => setInput((state) => ({ ...state, password: ev }))}
      />
      <ComponentButton
        title={"Log In"}
        onPress={handleSignin}
        buttonStyles={"mt-20"}
      />
      <View className="justify-center pt-5 flex-row gap-2">
        <Text className="text-lg text-gray-100 font-pregular">
          Don't have an account?
        </Text>
        <Link href="/signup" className="text-lg text-highlight">
          Sign Up
        </Link>
      </View>
      <View className="justify-center flex-row absolute bottom-20  w-[100%]">
        <Text className="text-sm text-gray-100 font-pregular">
          2024 Instaclone 🍑 created with React Native
        </Text>
      </View>
    </SafeAreaView>
  );
};
