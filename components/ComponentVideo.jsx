import { ResizeMode, Video } from "expo-av";
import React from "react";
import { View } from "react-native";

export default (props) => {
  const { source, className, type, isVisible, ...rest } = props;
  const [isPlaying, setIsPlaying] = React.useState(true);

  return (
    <View className="flex-1 p-2 items-center justify-center ">
      <Video
        className={`${className} w-full h-[675px] border-2 border-yellow-400 rounded-lg`}
        // playsInSilentModeIOS
        ignoreSilentSwitch={"ignore"}
        isLooping
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={isVisible}
        source={{ uri: source }}
        useNativeControls
        
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
