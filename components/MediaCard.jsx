import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { PixelRatio, View, Button, Text } from 'react-native';

export default ({title, link, creator}) => {
    const ref = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const player = useVideoPlayer("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", player => {
      player.loop = true;
      player.play();
    });
  
    useEffect(() => {
      const subscription = player.addListener('playingChange', isPlaying => {
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
          className="w-[350px] h-[275px]"
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
        <View className="p-10">
          <Button
            title={isPlaying ? 'Pause' : 'Play'}
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
      </View>
    );
  }