import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

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
        className="w-full h-14 px-4 bg-primary-200 rounded-2xl items-center flex-row"
        style={isFocused ? styles.focusedBorder : styles.defaultBorder}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={18}
            color={isFocused ? "#4DA6FF" : "#4A6080"}
            style={{ marginRight: 10 }}
          />
        )}
        <TextInput
          className="flex-1 text-white text-base"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#4A6080"
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
              color={isFocused ? "#4DA6FF" : "#4A6080"}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  defaultBorder: { borderWidth: 1, borderColor: "#1A3060" },
  focusedBorder: { borderWidth: 1, borderColor: "#4DA6FF" },
});
