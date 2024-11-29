import { Link, router } from "expo-router";
import { View, Text, StyleSheet, Alert } from "react-native";
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
    <SafeAreaView className="bg-primary h-full">
      <View className="justify-center flex-row ">
        <Text className="text-md font-semibold text-white mt-10 ">
          Sign up to see photos and videos from your friends.
        </Text>
      </View>
      <ComponentInput
        placeholder={"Username"}
        onChangeText={(ev) => setState((prev) => ({ ...prev, username: ev }))}
        textContentType={"username"}
      />
      <ComponentInput
        placeholder={"Email"}
        onChangeText={(ev) => setState((prev) => ({ ...prev, email: ev }))}
        textContentType={"emailAddress"}
      />
      <ComponentInput
        placeholder={"Password"}
        onChangeText={(ev) => setState((prev) => ({ ...prev, password: ev }))}
        textContentType={"newPassword"}
      />
      <ComponentButton
        title={"Sign up"}
        onPress={onSignUp}
        buttonStyles={"mt-20"}
      />

      <Text className="text-2xl font-semibold text-white mt-10 ">
        Have an account?{" "}
        <Link href="/signin" className="text-lg text-highlight">
          Log in
        </Link>
      </Text>
      <View className="justify-center flex-row absolute bottom-20  w-[100%]">
        <Text className="text-sm text-gray-100 font-pregular">
          2024 Instaclone 🍑 created with React Native
        </Text>
      </View>
    </SafeAreaView>
  );
};
