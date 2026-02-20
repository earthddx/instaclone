import { useVideoPlayer, VideoView } from "expo-video";
import React, { useRef, useEffect } from "react";
import { View } from "react-native";

export default (props) => {
  const { source, isVisible } = props;
  const videoRef = useRef(null);

  const streamUri = typeof source === "string"
    ? source.replace("/view?", "/download?")
    : source;

  const player = useVideoPlayer({ uri: streamUri }, (player) => {
    player.loop = true;
  });

  useEffect(() => {
    const sub = player.addListener("statusChange", ({ status, error }) => {
      if (status === "error") {
        console.error("[ComponentVideo] error:", error?.message, "| uri:", streamUri);
      }
    });
    return () => sub.remove();
  }, [player]);

  useEffect(() => {
    if (isVisible) {
      player.play();
    } else {
      player.pause();
    }
    return () => {
      try { player.pause(); } catch (_) { }
    };
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
