import React from "react";
import { Text, View } from "react-native";

export default ({ className, classNameText, message = "Not Found" }) => {
  return (
    <View
      className={`border-2 p-2 border-red-400 rounded-lg items-center mt-10 ${className}`}
    >
      <Text className={`text-white text-lg ${classNameText}`}>{message}</Text>
    </View>
  );
};
