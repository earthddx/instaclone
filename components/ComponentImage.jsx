import React from "react";
import { Image } from "expo-image";
import { View } from "react-native";

export default (props) => {
  const { source } = props;
  const uri = source?.replace("/preview", "/view");

  return (
    <View>
      <Image
        style={{ width: "100%", aspectRatio: 1 }}
        source={{ uri }}
        contentFit="cover"
      />
    </View>
  );
};
