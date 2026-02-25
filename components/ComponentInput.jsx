import { View, Text, TextInput, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/colors";

export default ({
  title,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  textContentType = "none",
  leftIcon,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  keyboardType,
  autoCapitalize,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View>
      {title ? (
        <Text className="text-sm text-gray-400 mb-2 ml-1">{title}</Text>
      ) : null}
      <View
        className={`w-full h-14 px-4 bg-primary-200 rounded-2xl items-center flex-row border ${isFocused ? 'border-secondary' : 'border-primary-300'}`}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={18}
            color={isFocused ? Colors.secondary.DEFAULT : Colors.muted.DEFAULT}
            style={{ marginRight: 10 }}
          />
        )}
        <TextInput
          className="flex-1 text-white text-[16px] py-0"
          textAlignVertical="center"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.muted.DEFAULT}
          secureTextEntry={secureTextEntry}
          textContentType={textContentType}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? "none"}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {showPasswordToggle && (
          <Pressable onPress={onTogglePassword} hitSlop={8}>
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={isFocused ? Colors.secondary.DEFAULT : Colors.muted.DEFAULT}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};
