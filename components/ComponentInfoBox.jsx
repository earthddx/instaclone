import { View, Text } from "react-native";

export default ({
  placeholder,
  title,
  subtitle,
  containerStyles,
  titleStyles,
}) => {
  return (
    <View className={containerStyles}>
      {!title && placeholder ? (
        <Text className={`text-gray-500 text-center italic`}>{placeholder}</Text>
      ) : (
        <Text className={`text-white text-center ${titleStyles}`}>{title}</Text>
      )}
      <Text className="text-sm text-gray-500 text-center">
        {subtitle}
      </Text>
    </View>
  );
};
