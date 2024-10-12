import { useVideoPlayer, VideoView } from "expo-video";
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

//TODO: should call ComponentImage and ComponentVideo
export default (props) => {
  const { title, type = "image", source, creator, isVisible } = props;
  return (
    <View className="border-2 border-secondary rounded-lg mt-5 mb-5">
      {type.includes("image") ? (
        <Image source={{ uri: source }} className="w-[250px] h-[250px]" />
      ) : (
        <ComponentVideo
          {...props}
          source={source}
          className="w-full h-[600px]"
          allowsFullscreen
          allowsPictureInPicture
          isVisible={isVisible}
        />
      )}
      <Text className="text-white text-base">{title}</Text>
      <Text className="text-highlight">by {creator}</Text>
      <View className="pt-2">
        <Text>❤️</Text>
        {/* <Image source={likeIcon} className="w-5 h-5" resizeMode="contain" /> */}
      </View>
      <TextInput placeholder="Leave a comment..." />
    </View>
  );
};
