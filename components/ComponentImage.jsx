import React from "react";
import { Image } from "expo-image";
import { View } from "react-native";

export default (props) => {
  const { source } = props;
  const uri = source?.replace("/preview", "/view");

  return (
    <View className="p-2">
      <Image
        style={{ width: "100%", height: 675, borderRadius: 8, borderWidth: 2, borderColor: "#facc15" }}
        source={{ uri }}
        contentFit="contain"
      />
    </View>
  );
};
