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
  multiline = false,
  returnKeyType,
  minHeight,
  scrollable = false,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View>
      {title ? (
        <Text className="text-sm text-muted-300 mb-2 ml-1">{title}</Text>
      ) : null}
      <View
        className={`w-full px-4 bg-primary-200 rounded-2xl flex-row border ${isFocused ? "border-secondary" : "border-primary-300"} ${multiline ? "items-start py-3" : "h-14 items-center"}`}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={18}
            color={isFocused ? Colors.secondary.DEFAULT : Colors.muted.DEFAULT}
            style={{ marginRight: 10, marginTop: multiline ? 1 : 0 }}
          />
        )}
        <TextInput
          className="flex-1 text-white text-[16px] py-0"
          textAlignVertical={multiline ? "top" : "center"}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.muted.DEFAULT}
          secureTextEntry={secureTextEntry}
          textContentType={textContentType}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? "none"}
          multiline={multiline}
          returnKeyType={returnKeyType}
          style={minHeight ? (scrollable ? { height: minHeight } : { minHeight }) : undefined}
          scrollEnabled={scrollable ? true : undefined}
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
