import { useEffect, useRef, useState } from "react";
import {
  PixelRatio,
  View,
  Button,
  Text,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import ComponentVideo from "./ComponentVideo";
import ComponentImage from "./ComponentImage";

export default (props) => {
  const {
    description,
    title,
    type = "image",
    source,
    creator,
    isVisible,
  } = props;
  return (
    <View className="border-2 border-secondary rounded-lg mt-5 mb-5">
      {type.includes("image") ? (
        <ComponentImage
        {...props}
          // className="w-[250px] h-[250px]"
          source={source}
        />
      ) : (
        <ComponentVideo
          {...props}
          // className="w-full h-[600px]"
          source={source}
          allowsFullscreen
          allowsPictureInPicture
          isVisible={isVisible}
        />
      )}
      <Text className="text-white text-base">{title}</Text>
      <Text className="text-highlight">by {creator}</Text>
      <View className="pt-2">
        <Text className="text-white text-sm">{description}</Text>
        {/* <Image source={likeIcon} className="w-5 h-5" resizeMode="contain" /> */}
      </View>
      <TextInput placeholder="Leave a comment..." />
    </View>
  );
};
