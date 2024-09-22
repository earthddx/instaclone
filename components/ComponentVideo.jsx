import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import { PixelRatio, StyleSheet, View, Button } from "react-native";

const videoSourceDefault =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default (props) => {
  const { source, className, type, ...rest } = props;
  const ref = React.useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const player = useVideoPlayer(source, (player) => {
    if (!source) return;
    player.loop = true;
    player.play();
  });

  React.useEffect(() => {
    const subscription = player.addListener("playingChange", (isPlaying) => {
      setIsPlaying(isPlaying);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  return (
    <View className="flex-1 p-10 items-center justify-center ">
      <VideoView
        ref={ref}
        className={`${className} w-[350px] h-[275px] border-2 border-yellow-400 rounded-lg`}
        player={player}
        {...rest}
      />
      <View className={"p-10"}>
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
      </View>
    </View>
  );
};
