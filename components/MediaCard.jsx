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
} from "react-native";
import ComponentVideo from "./ComponentVideo";

//TODO: should call ComponentImage and ComponentVideo
export default ({ title, link, creator }) => {
  return (
    <View className="border-2 border-secondary rounded-lg mt-5 mb-5">
      <ComponentVideo
        className="w-full h-[500px]"
        allowsFullscreen
        allowsPictureInPicture
      />

      <Text className="text-white text-base">{title}</Text>
      <Text className="text-highlight">by {creator}</Text>
      <View className="pt-2">
        <Text>❤️</Text>
        {/* <Image source={likeIcon} className="w-5 h-5" resizeMode="contain" /> */}
      </View>
      <TextInput placeholder="Leave a comment..." />
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        placeholder="Leave a comment..."
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <TextInput placeholder="Leave a comment..." />
            <View>
              <Button title="Submit" onPress={() => null} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView> */}
    </View>
  );
};
