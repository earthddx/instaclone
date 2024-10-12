import { ResizeMode, Video } from "expo-av";
import React from "react";
import { PixelRatio, Dimensions, View, Button } from "react-native";

export default (props) => {
  const { source, className, type, isVisible, ...rest } = props;
  const [isPlaying, setIsPlaying] = React.useState(true);


  return (
    <View className="flex-1 p-2 items-center justify-center ">
      <Video
       source={{ uri: source }}
        className={`${className} w-full h-[675px] border-2 border-yellow-400 rounded-lg`}
        shouldPlay={isVisible}
        isLooping
        useNativeControls
        ignoreSilentSwitch={"ignore"}
      />
      {/* <View className={"p-5"}>
        <Button
          title={isPlaying ? "Pause" : "Play"}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
            setIsPlaying(!isPlaying);
          }}
        />
      </View> */}
    </View>
  );
};
