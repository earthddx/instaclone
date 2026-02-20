import { Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";

export default ({ isLoading, title, onPress, textStyles, buttonStyles }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`bg-highlight rounded-2xl min-h-[54px] justify-center items-center ${buttonStyles} ${
        isLoading ? "opacity-70" : ""
      }`}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text className={`text-white text-base font-semibold tracking-wide ${textStyles}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
