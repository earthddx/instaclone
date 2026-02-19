import React from "react";
import { Text, View } from "react-native";

export default ({ className, classNameText, message = "Not Found" }) => {
  return (
    <View
      className={`p-4 rounded-xl items-center mt-10 ${className}`}
    >
      <Text className={`text-gray-400 text-base ${classNameText}`}>{message}</Text>
    </View>
  );
};
