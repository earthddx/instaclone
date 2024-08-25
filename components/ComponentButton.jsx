import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomButton = ({ title, onPress, textStyles, buttonStyles }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      //   activeOpacity={0.7}
      className={`bg-highlight rounded-xl min-h-[62px] justify-center items-center ${buttonStyles}`}
      //   disabled={isLoading}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
