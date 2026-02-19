import { View, Text, TextInput } from "react-native";
import React from "react";

export default ({
  title,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  textContentType = "none",
}) => {
  return (
    <View className={`space-y-2`}>
      {/* FIXME: style title like in MUI? */}
      <Text className="text-base text-gray-100">{title}</Text>
      <View className="border border-primary-300 w-full h-16 px-4 bg-primary-200 rounded-2xl items-center flex-row">
        <TextInput
          className="flex-1 text-white text-base"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#4A6080"
          secureTextEntry={secureTextEntry}
          textContentType={textContentType}
        />
      </View>
    </View>
  );
};
