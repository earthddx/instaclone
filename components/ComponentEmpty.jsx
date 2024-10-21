import React from "react";
import { Text, View } from "react-native";

export default ({message = "No Posts Found"}) => {
  return (
    <View className="border-2 p-2 border-red-400 rounded-lg items-center mt-10">
      <Text className="text-white text-lg">{message}</Text>
    </View>
  );
};
