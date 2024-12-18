import {
  KeyboardAvoidingView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className={`space-y-2`}>
        {/* FIXME: style title like in MUI? */}
        <Text className="text-base text-gray-100">{title}</Text>
        <View className="border-2 border-highlight w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
          <TextInput
            className="flex-1 text-white text-base"
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            textContentType={textContentType}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
