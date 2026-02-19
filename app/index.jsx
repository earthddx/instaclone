import React from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View, Pressable } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "../context/UserContext";
import { getLoggedInUser } from "../lib/appwrite";
import RotatingSquare from "../components/RotatingSquare";
import ComponentButton from "../components/ComponentButton";

export default function App() {
  const { user } = React.useContext(UserContext);

  // console.log("user", user);
  // console.log("getLoggedInUser", getLoggedInUser());
  if (user) {
    return <Redirect href={"/home"} />;
  }
  // return (
  //   <RotatingSquare
  //     topAdornment={
  //       <Text className="text-3xl text-white mt-10">Instaclone</Text>
  //     }
  //     bottomAdornment={
  //       <ComponentButton
  //         title="Sign In"
  //         onPress={() => router.push("/signin")}
  //         textStyles={"text-3xl text-white"}
  //         buttonStyles={"mb-10"}
  //       />
  //     }
  //   />
  // );
  return (
    <SafeAreaView className="bg-highlight h-full">
      {/* <StatusBar backgroundColor="#0d0d0d" style="light" /> */}
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="h-full justify-center items-center border-2 border-green-400 rounded-lg">
          <Text className="text-3xl text-white mt-10">INSTACLONE 🎯</Text>
          <Pressable onPress={() => router.push("/signin")}>
            <Text className="text-3xl ">Click me to go to sign in page</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
