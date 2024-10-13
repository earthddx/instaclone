import React from "react";
import { Image } from "react-native";
import { ResizeMode } from "expo-av";
import { View } from "react-native";

export default (props) => {
  const { source, className, ...rest } = props;

  return (
    <View className="p-2">
      <Image
        className={`${className} w-full h-[675px] border-2 border-yellow-400 rounded-lg`}
        source={{ uri: source }}
        resizeMode={ResizeMode.CONTAIN}
      />
    </View>
  );
};
