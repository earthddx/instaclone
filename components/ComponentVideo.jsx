import { Audio, ResizeMode, Video } from "expo-av";
import React from "react";
import { View } from "react-native";

export default (props) => {
  const { source, className, type, isVisible, ...rest } = props;
  const videoRef = React.useRef(null);
  const [status, setStatus] = React.useState({});

  React.useEffect(() => {
    if(!videoRef) return;
    if (status.isPlaying) {
      triggerAudio(videoRef);
    }
  }, [videoRef, status.isPlaying]);

  const triggerAudio = async (ref) => {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    videoRef.current.playAsync();
  };

  return (
    <View className="flex-1 p-2 items-center justify-center ">
      <Video
        ref={videoRef}
        className={`${className} w-full h-[675px] border-2 border-yellow-400 rounded-lg`}
        playsInSilentModeIOS
        ignoreSilentSwitch={"ignore"}
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(status)}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={isVisible}
        source={{ uri: source }}
        useNativeControls
      />
      {/* TODO: position it over the video and hide controls */}
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
