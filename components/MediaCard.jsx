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

export default ({ title, link, creator }) => {
  const ref = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const player = useVideoPlayer(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    (player) => {
      player.loop = true;
      player.muted = true;
      //   player.play();
    }
  );
  //TODO: create a dynamic route for the post when its clicked - > posts/:postId
  //https://egghead.io/lessons/react-create-a-new-react-app-with-degit
  useEffect(() => {
    const subscription = player.addListener("playingChange", (isPlaying) => {
      setIsPlaying(isPlaying);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  return (
    <View className="items-center justify-center border-2 border-secondary rounded-lg mt-5 mb-5">
      <VideoView
        ref={ref}
        className="w-full h-[500px]"
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
      <View className="p-2">
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
