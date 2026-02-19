import { useVideoPlayer, VideoView } from "expo-video";
import React, { useRef, useEffect } from "react";
import { View } from "react-native";

export default (props) => {
  const { source, isVisible } = props;
  const videoRef = useRef(null);

  const player = useVideoPlayer({ uri: source }, (player) => {
    player.loop = true;
  });

  useEffect(() => {
    if (isVisible) {
      player.play();
    } else {
      player.pause();
    }
  }, [isVisible, player]);

  return (
    <View className="p-2">
      <VideoView
        ref={videoRef}
        player={player}
        style={{ width: "100%", height: 675, borderRadius: 8, borderWidth: 2, borderColor: "#facc15" }}
        contentFit="contain"
        nativeControls
      />
    </View>
  );
};
