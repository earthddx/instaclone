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
    <View>
      <VideoView
        ref={videoRef}
        player={player}
        style={{ width: "100%", aspectRatio: 4 / 5 }}
        contentFit="contain"
        nativeControls
      />
    </View>
  );
};
